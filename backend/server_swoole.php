<?php
declare(strict_types=1);

namespace Rendezvous;

use Swoole\WebSocket\Server;
use Swoole\Http\Request;
use Swoole\WebSocket\Frame;
use Swoole\Coroutine;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__ . '/vendor/autoload.php';

/**
 * High-Throughput Async PHP WebSocket & HTTP Server for Rendezvous
 * Handles 100k+ concurrent connections, E2EE key exchange & live radar.
 */
class RendezvousSocketServer
{
    private Server $server;
    private string $jwtSecret;

    public function __construct(string $host = '0.0.0.0', int $port = 9501)
    {
        $this->jwtSecret = getenv('JWT_SECRET') ?: 'rendezvous_super_secret_e2ee_jwt_key_2026';
        $this->server = new Server($host, $port);
        
        $this->server->set([
            'worker_num'               => swoole_cpu_num() * 2,
            'enable_coroutine'         => true,
            'max_connection'           => 100000,
            'open_websocket_close_frame'=> true,
            'heartbeat_check_interval' => 60,
            'heartbeat_idle_time'      => 120,
        ]);

        $this->server->on('start', [$this, 'onStart']);
        $this->server->on('open', [$this, 'onOpen']);
        $this->server->on('message', [$this, 'onMessage']);
        $this->server->on('close', [$this, 'onClose']);
    }

    public function onStart(Server $server): void
    {
        echo "========================================================\n";
        echo " [Rendezvous] Swoole PHP 8.3 Async WebSocket Server Running\n";
        echo " Host: " . $server->host . ":" . $server->port . "\n";
        echo " E2EE Session Broker & Real-Time Radar Active\n";
        echo "========================================================\n";
    }

    public function onOpen(Server $server, Request $request): void
    {
        $token = $request->get['token'] ?? null;
        $userId = $this->verifyJwtToken($token);

        if (!$userId) {
            $server->disconnect($request->fd, 4001, 'Unauthorized');
            return;
        }

        echo "[WS Open] User connected: {$userId} on fd: {$request->fd}\n";

        // Store user connection in Redis
        Coroutine::create(function () use ($userId, $request) {
            $redis = new \Redis();
            $redisHost = getenv('REDIS_HOST') ?: '127.0.0.1';
            $redisPort = (int)(getenv('REDIS_PORT') ?: 6379);
            if (@$redis->connect($redisHost, $redisPort)) {
                $redis->hSet('rendezvous:active_fds', (string)$request->fd, $userId);
                $redis->hSet('rendezvous:user_fds', $userId, (string)$request->fd);
            }
        });
    }

    public function onMessage(Server $server, Frame $frame): void
    {
        $payload = json_decode($frame->data, true);
        if (!$payload || !isset($payload['action'])) {
            return;
        }

        switch ($payload['action']) {
            case 'LOCATION_UPDATE':
                // Update GEO position for radar matching
                $this->updateRadarCoords($payload['user_id'], (float)$payload['lat'], (float)$payload['lng']);
                break;

            case 'E2EE_MESSAGE_RELAY':
                // Relay E2EE ciphertext without accessing unencrypted content
                $this->routeEncryptedMessage($server, $payload['receiver_id'], $payload);
                break;

            case 'ESCROW_STATUS_CHANGE':
                // Notify participants about payment release
                $this->broadcastBookingUpdate($server, $payload['client_id'], $payload['companion_id'], $payload['booking_id'], $payload['status']);
                break;
        }
    }

    public function onClose(Server $server, int $fd): void
    {
        echo "[WS Close] Client disconnected on fd: {$fd}\n";
        Coroutine::create(function () use ($fd) {
            $redis = new \Redis();
            $redisHost = getenv('REDIS_HOST') ?: '127.0.0.1';
            if (@$redis->connect($redisHost, 6379)) {
                $userId = $redis->hGet('rendezvous:active_fds', (string)$fd);
                if ($userId) {
                    $redis->hDel('rendezvous:active_fds', (string)$fd);
                    $redis->hDel('rendezvous:user_fds', $userId);
                }
            }
        });
    }

    private function updateRadarCoords(string $userId, float $lat, float $lng): void
    {
        Coroutine::create(function () use ($userId, $lat, $lng) {
            $redis = new \Redis();
            $redisHost = getenv('REDIS_HOST') ?: '127.0.0.1';
            if (@$redis->connect($redisHost, 6379)) {
                $redis->rawCommand('GEOADD', 'rendezvous:users_geo', $lng, $lat, $userId);
            }
        });
    }

    private function routeEncryptedMessage(Server $server, string $receiverId, array $data): void
    {
        Coroutine::create(function () use ($server, $receiverId, $data) {
            $redis = new \Redis();
            $redisHost = getenv('REDIS_HOST') ?: '127.0.0.1';
            if (@$redis->connect($redisHost, 6379)) {
                $targetFd = $redis->hGet('rendezvous:user_fds', $receiverId);
                if ($targetFd && $server->isEstablished((int)$targetFd)) {
                    $server->push((int)$targetFd, json_encode([
                        'event'       => 'NEW_E2EE_MESSAGE',
                        'sender_id'   => $data['sender_id'],
                        'cipher_blob' => $data['cipher_blob'],
                        'timestamp'   => time()
                    ]));
                }
            }
        });
    }

    private function broadcastBookingUpdate(Server $server, string $clientId, string $companionId, string $bookingId, string $status): void
    {
        $message = json_encode([
            'event'      => 'ESCROW_UPDATED',
            'booking_id' => $bookingId,
            'status'     => $status,
            'time'       => date('c')
        ]);

        foreach ([$clientId, $companionId] as $uid) {
            Coroutine::create(function () use ($server, $uid, $message) {
                $redis = new \Redis();
                if (@$redis->connect(getenv('REDIS_HOST') ?: '127.0.0.1', 6379)) {
                    $fd = $redis->hGet('rendezvous:user_fds', $uid);
                    if ($fd && $server->isEstablished((int)$fd)) {
                        $server->push((int)$fd, $message);
                    }
                }
            });
        }
    }

    private function verifyJwtToken(?string $token): ?string
    {
        if (!$token) return null;
        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
            return $decoded->sub ?? null;
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function start(): void
    {
        $this->server->start();
    }
}

if (php_sapi_name() === 'cli') {
    $server = new RendezvousSocketServer();
    $server->start();
}
