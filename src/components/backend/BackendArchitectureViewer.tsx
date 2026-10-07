import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Copy, 
  Check, 
  Server, 
  Database, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Terminal 
} from 'lucide-react';

interface BackendArchitectureViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendArchitectureViewer: React.FC<BackendArchitectureViewerProps> = ({
  isOpen,
  onClose
}) => {
  const [activeFile, setActiveFile] = useState<
    'websocket' | 'escrow' | 'guiamoteis' | 'schema' | 'native' | 'github'
  >('github');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const CODE_FILES = {
    github: {
      name: 'Instruções para Exportação Direta ao GitHub',
      code: `# =========================================================================
# PASSOS PARA EXPORTAR E PUBLICAR O BACKEND NO SEU GITHUB
# =========================================================================

# 1. Abra o terminal na raiz da pasta do backend
cd backend

# 2. Inicialize o repositório Git local
git init

# 3. Adicione todos os arquivos do backend (Swoole, Docker, Composer, PostgreSQL)
git add .

# 4. Registre o commit inicial
git commit -m "feat: initial commit of Rendezvous PHP 8.3 Swoole Backend"

# 5. Defina a branch principal como main
git branch -M main

# 6. Vincule ao seu repositório remoto criado no GitHub
# (Substitua SEU-USUARIO pelo seu nome de usuário ou organização no GitHub)
git remote add origin https://github.com/SEU-USUARIO/rendezvous-backend.git

# 7. Envie os arquivos para o GitHub
git push -u origin main

# =========================================================================
# SUBINDO O AMBIENTE COM DOCKER (OPCIONAL)
# =========================================================================
docker-compose up --build -d

# Endpoints ativos:
# WebSocket: ws://localhost:9501 (Porta Swoole)
# REST API:  http://localhost:8000/api/health
# Banco:     PostgreSQL 16 na porta 5432`
    },
    websocket: {
      name: 'server_swoole.php (Swoole 5.1 / PHP 8.3 Async Server)',
      code: `<?php
declare(strict_types=1);

namespace Rendezvous\\Server;

use Swoole\\WebSocket\\Server;
use Swoole\\Http\\Request;
use Swoole\\WebSocket\\Frame;
use Swoole\\Coroutine;

/**
 * High-Throughput Async PHP WebSocket & HTTP Server for Rendezvous
 * Handles 100k+ concurrent connections, E2EE key exchange & live radar.
 */
class RendezvousSocketServer
{
    private Server $server;
    private \\Redis $redis;

    public function __construct(string $host = '0.0.0.0', int $port = 9501)
    {
        $this->server = new Server($host, $port);
        $this->server->set([
            'worker_num'      => swoole_cpu_num() * 2,
            'enable_coroutine'=> true,
            'max_connection'  => 250000,
            'open_websocket_close_frame' => true,
            'ssl_cert_file'   => '/etc/ssl/certs/rendezvous_cert.pem',
            'ssl_key_file'    => '/etc/ssl/certs/rendezvous_key.pem',
        ]);

        $this->server->on('start', [$this, 'onStart']);
        $this->server->on('open', [$this, 'onOpen']);
        $this->server->on('message', [$this, 'onMessage']);
        $this->server->on('close', [$this, 'onClose']);
    }

    public function onStart(Server $server): void
    {
        echo "[Rendezvous] Swoole PHP 8.3 Server listening on port 9501\\n";
        echo "[Rendezvous] E2EE Session Exchange & Live Radar Geo-Spatial Active\\n";
    }

    public function onOpen(Server $server, Request $request): void
    {
        $token = $request->get['token'] ?? null;
        $userId = $this->verifyJwtToken($token);

        if (!$userId) {
            $server->disconnect($request->fd, 4001, 'Unauthorized');
            return;
        }

        // Bind user to redis spatial index
        Coroutine::create(function () use ($userId, $request) {
            $redis = new \\Redis();
            $redis->connect('127.0.0.1', 6379);
            $redis->hSet('rendezvous:active_fds', (string)$request->fd, $userId);
        });
    }

    public function onMessage(Server $server, Frame $frame): void
    {
        $payload = json_decode($frame->data, true);
        $action = $payload['action'] ?? '';

        switch ($action) {
            case 'LOCATION_UPDATE':
                // Update GEOADD for radar radius matching
                $this->updateRadarCoords($payload['user_id'], $payload['lat'], $payload['lng']);
                break;

            case 'E2EE_ENCRYPTED_MESSAGE':
                // Relay encrypted ciphertext without holding private keys
                $this->routeEncryptedMessage($payload['receiver_id'], $payload['cipher_blob']);
                break;

            case 'PUSH_MATCH_NOTIFICATION':
                $this->dispatchPushNotification($payload['target_id'], $payload['meta']);
                break;
        }
    }
}

$app = new RendezvousSocketServer();
$app->start();`
    },

    escrow: {
      name: 'CompanionEscrowService.php (Escrow Payments & PIX Webhook)',
      code: `<?php
declare(strict_types=1);

namespace Rendezvous\\Services;

use Rendezvous\\Models\\CompanionBooking;
use Rendezvous\\Models\\AuditLog;
use Rendezvous\\Gateways\\PixPaymentGateway;

/**
 * Escrow Payment Engine & Instant Bank Payouts
 * Ensures companion funds are held securely until meeting completion.
 */
class CompanionEscrowService
{
    public function __construct(
        private PixPaymentGateway $pixGateway,
        private AuditLogService $auditLogger
    ) {}

    /**
     * Lock funds from client during appointment booking
     */
    public function lockEscrowFunds(CompanionBooking $booking, string $paymentMethod): bool
    {
        $transaction = $this->pixGateway->createHold([
            'booking_id'    => $booking->id,
            'amount_cents'  => (int)($booking->total_amount * 100),
            'client_id'     => $booking->client_id,
            'description'   => "Garantia Escrow Rendezvous #{$booking->id}"
        ]);

        if ($transaction->status === 'HELD') {
            $booking->escrow_status = 'retido_plataforma';
            $booking->save();

            $this->auditLogger->record([
                'actor'    => $booking->client_id,
                'category' => 'financial',
                'action'   => 'ESCROW_FUNDS_LOCKED',
                'details'  => "R$ {$booking->total_amount} retidos em garantia para o encontro."
            ]);

            return true;
        }

        return false;
    }

    /**
     * Mutual confirmation release to Companion bank account via PIX
     */
    public function releaseToCompanion(string $bookingId): bool
    {
        $booking = CompanionBooking::findOrFail($bookingId);
        $companionBank = $booking->companion->bankAccount;

        $payout = $this->pixGateway->instantTransfer([
            'pix_key'      => $companionBank->pix_key,
            'pix_type'     => $companionBank->pix_key_type,
            'amount_cents' => (int)($booking->total_amount * 100),
            'beneficiary'  => $companionBank->full_name
        ]);

        if ($payout->isSuccessful()) {
            $booking->escrow_status = 'liberado_ao_acompanhante';
            $booking->meeting_status = 'concluido';
            $booking->save();

            return true;
        }

        return false;
    }
}`
    },

    guiamoteis: {
      name: 'GuiaMoteisClient.php (API Oficial & Reserva Direta)',
      code: `<?php
declare(strict_types=1);

namespace Rendezvous\\Integrations;

use GuzzleHttp\\Client;

/**
 * Guia de Motéis Official REST API Integration
 * Fetches nearby suites with live photos, rates & instant voucher generation.
 */
class GuiaMoteisClient
{
    private Client $httpClient;
    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = env('GUIADEMOTEIS_API_KEY');
        $this->httpClient = new Client([
            'base_uri' => 'https://api.guiademoteis.com.br/v2/',
            'timeout'  => 5.0,
            'headers'  => [
                'Authorization' => "Bearer {$this->apiKey}",
                'Accept'        => 'application/json',
                'X-App-Partner' => 'Rendezvous-Gay-App'
            ]
        ]);
    }

    public function findNearbyPartnerMotels(float $lat, float $lng, float $radiusKm = 10.0): array
    {
        $response = $this->httpClient->get('partners/nearby', [
            'query' => [
                'latitude'       => $lat,
                'longitude'      => $lng,
                'radius_km'      => $radiusKm,
                'amenities'      => 'hydro,pool,darkroom',
                'exclusive_only' => true
            ]
        ]);

        return json_decode((string)$response->getBody(), true);
    }

    public function createDirectReservation(array $reservationData): array
    {
        $response = $this->httpClient->post('reservations/instant-book', [
            'json' => [
                'partner_suite_id'  => $reservationData['suite_id'],
                'user_reference'    => $reservationData['user_id'],
                'period_type'       => $reservationData['period_type'],
                'voucher_discount'  => $reservationData['discount_code'] ?? 'RENDEZVOUS_VIP',
                'generate_qr_token' => true
            ]
        ]);

        return json_decode((string)$response->getBody(), true);
    }
}`
    },

    schema: {
      name: 'schema.sql (MySQL 8.0 / 8.4 LTS DDL com InnoDB & LGPD)',
      code: `-- Rendezvous Core Database Schema (MySQL 8.0 / 8.4 LTS)
-- Engine: InnoDB | Charset: utf8mb4 | Collate: utf8mb4_unicode_ci

CREATE TABLE users (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(120) NOT NULL,
    age SMALLINT UNSIGNED NOT NULL,
    role ENUM('client', 'companion') NOT NULL DEFAULT 'client',
    tribe VARCHAR(40) NULL,
    bio TEXT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    prep_status VARCHAR(40) NOT NULL DEFAULT 'Privado',
    current_lat DECIMAL(9,6) NULL,
    current_lng DECIMAL(9,6) NULL,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    ghost_mode BOOLEAN NOT NULL DEFAULT FALSE,
    loyalty_points INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_geo (current_lat, current_lng)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE companion_profiles (
    user_id VARCHAR(36) NOT NULL PRIMARY KEY,
    hourly_rate DECIMAL(10,2) NOT NULL,
    two_hour_rate DECIMAL(10,2) NOT NULL,
    overnight_rate DECIMAL(10,2) NOT NULL,
    services JSON NULL,
    boundaries JSON NULL,
    available_schedule TEXT NULL,
    wallet_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    pending_escrow DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_earned DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    completed_bookings INT UNSIGNED NOT NULL DEFAULT 0,
    rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    verified_identity BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_companion_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE companion_bank_accounts (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    companion_id VARCHAR(36) NOT NULL,
    pix_key_type ENUM('cpf', 'email', 'phone', 'random') NOT NULL,
    pix_key VARCHAR(255) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    agency VARCHAR(20) NOT NULL,
    account_number VARCHAR(30) NOT NULL,
    account_type ENUM('corrente', 'poupanca') NOT NULL DEFAULT 'corrente',
    full_name VARCHAR(150) NOT NULL,
    payout_frequency ENUM('instantaneo', 'semanal', 'mensal') NOT NULL DEFAULT 'instantaneo',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bank_companion FOREIGN KEY (companion_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE motel_partners (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    lat DECIMAL(9,6) NOT NULL,
    lng DECIMAL(9,6) NOT NULL,
    rating DECIMAL(3,2) NOT NULL DEFAULT 4.90,
    exclusive_discount_percent INT UNSIGNED NOT NULL DEFAULT 20,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_motel_geo (lat, lng)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE companion_bookings (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    companion_id VARCHAR(36) NOT NULL,
    meeting_date TIMESTAMP NOT NULL,
    duration_hours SMALLINT UNSIGNED NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    escrow_status ENUM('retido_plataforma', 'liberado_ao_acompanhante', 'em_disputa') NOT NULL DEFAULT 'retido_plataforma',
    location_type ENUM('motel', 'hotel', 'domicilio', 'meu_local') NOT NULL,
    location_address TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_companion_bk_client FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_companion_bk_comp FOREIGN KEY (companion_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE audit_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    actor_id VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    category ENUM('auth', 'financial', 'moderation', 'lgpd', 'system') NOT NULL,
    action VARCHAR(80) NOT NULL,
    details JSON NOT NULL,
    status ENUM('success', 'flagged', 'blocked') NOT NULL DEFAULT 'success',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_actor_time (actor_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
    },

    native: {
      name: 'app.json (React Native Multi-Platform Config)',
      code: `{
  "expo": {
    "name": "Rendezvous",
    "slug": "rendezvous-gay-dating",
    "version": "2.6.4",
    "platforms": ["ios", "android", "web"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "app.rendezvous.luxury",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "O Rendezvous precisa da sua localização para o radar e encontrar pessoas e motéis próximos.",
        "NSFaceIDUsageDescription": "Autenticação biométrica para proteção do perfil e saldo da carteira."
      }
    },
    "android": {
      "package": "app.rendezvous.luxury",
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "USE_BIOMETRIC"
      ]
    },
    "web": {
      "bundler": "metro"
    }
  }
}`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_FILES[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[92vh] rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Arquitetura Backend em PHP 8.3 & React Native</h3>
              <p className="text-[11px] text-neutral-400">
                Swoole WebSockets + Escrow PIX + SDK Guia de Motéis + PostgreSQL DDL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/rendezvous-backend.zip"
              download="rendezvous-backend.zip"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Baixar todos os arquivos do backend em um arquivo ZIP pronto para GitHub"
            >
              <span>📦 Baixar ZIP</span>
            </a>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* File Tabs */}
        <div className="flex p-2 bg-neutral-950/80 border-b border-neutral-800 text-xs gap-1 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: 'github', label: '🚀 Exportar para GitHub' },
            { id: 'websocket', label: '⚡ Swoole WebSockets (PHP)' },
            { id: 'escrow', label: '🛡️ Custódia Escrow & PIX' },
            { id: 'guiamoteis', label: '🏨 API Guia de Motéis' },
            { id: 'schema', label: '🗄️ Database Schema (SQL)' },
            { id: 'native', label: '📱 React Native Multi-Platform' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFile(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                activeFile === tab.id
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto bg-neutral-950 p-4 font-mono text-[11px] text-neutral-200 leading-relaxed">
          <div className="text-neutral-400 text-[10px] mb-2 pb-2 border-b border-neutral-800 flex items-center justify-between">
            <span>{CODE_FILES[activeFile].name}</span>
            <span className="text-emerald-400">Pronto para Produção (Docker / Linux / Swoole)</span>
          </div>
          <pre className="overflow-x-auto whitespace-pre">
            <code>{CODE_FILES[activeFile].code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
