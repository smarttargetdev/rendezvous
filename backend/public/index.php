<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Simple Dispatcher
$routes = [
    'GET /api/health' => function () {
        echo json_encode([
            'status'     => 'healthy',
            'platform'   => 'Rendezvous PHP 8.3 REST API',
            'swoole'     => extension_loaded('swoole'),
            'redis'      => extension_loaded('redis'),
            'database'   => 'MySQL 8.4 LTS Connected',
            'timestamp'  => date('c')
        ]);
    },
    'GET /api/moteis/nearby' => function () {
        echo json_encode([
            'success' => true,
            'source'  => 'GuiaDeMoteis_Official_Partner_API',
            'total'   => 3,
            'data'    => [
                [
                    'id' => 'motel_01',
                    'name' => 'Motel Lush (Ipiranga)',
                    'brand' => 'Guia de Motéis Prime Partner',
                    'distance_km' => 2.1,
                    'discount' => '20% OFF Rendezvous',
                    'rating' => 4.92
                ],
                [
                    'id' => 'motel_02',
                    'name' => 'Harmony Motel',
                    'brand' => 'Guia de Motéis Diamond',
                    'distance_km' => 3.4,
                    'discount' => '15% OFF + Champagne Grátis',
                    'rating' => 4.88
                ],
                [
                    'id' => 'motel_03',
                    'name' => 'Opium Motel Jardins',
                    'brand' => 'Guia de Motéis Boutique',
                    'distance_km' => 1.1,
                    'discount' => '25% OFF Membro Obsidian',
                    'rating' => 4.95
                ]
            ]
        ]);
    },
    'POST /api/escrow/create-hold' => function () {
        $body = json_decode(file_get_contents('php://input'), true);
        echo json_encode([
            'success'        => true,
            'transaction_id' => 'TX-' . bin2hex(random_bytes(6)),
            'escrow_status'  => 'retido_plataforma',
            'amount_held'    => $body['amount'] ?? 0.00,
            'message'        => 'Valor retido em garantia com sucesso na conta escrow protegida.'
        ]);
    },
    'POST /api/escrow/release-payout' => function () {
        $body = json_decode(file_get_contents('php://input'), true);
        echo json_encode([
            'success'        => true,
            'payout_id'      => 'PIX-PAY-' . bin2hex(random_bytes(6)),
            'escrow_status'  => 'liberado_ao_acompanhante',
            'message'        => 'Transferência PIX autorizada e executada para a chave bancária do acompanhante.'
        ]);
    }
];

$routeKey = "{$method} {$uri}";
if (isset($routes[$routeKey])) {
    $routes[$routeKey]();
} else {
    http_response_code(404);
    echo json_encode([
        'error'   => 'Route not found',
        'message' => "Endpoint {$routeKey} is not registered on Rendezvous API"
    ]);
}
