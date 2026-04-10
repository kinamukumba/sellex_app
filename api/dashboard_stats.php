<?php
// =============================================================================
// dashboard_stats.php — Endpoint para Estatísticas do Admin Dashboard
// =============================================================================

ob_start();
ini_set('display_errors', '0');
error_reporting(0);

header('Access-Control-Allow-Origin: *'); // Mudar para o domínio host do painel no futuro
header('Access-Control-Allow-Headers: Content-Type, x-api-key');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/db.php';

// Segurança: Verificar Chave
$providedApiKey = $_SERVER['HTTP_X_API_KEY'] ?? '';
if ($providedApiKey !== API_KEY) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Acesso Negado: Chave da API ausente ou inválida.']);
    exit;
}

try {
    $pdo = getPDO();

    // Verifica se a tabela já existe (Prevenção de Erros caso acessem antes de ter leads)
    $tableExists = $pdo->query("SHOW TABLES LIKE 'book_demo_requests'")->rowCount() > 0;
    
    if (!$tableExists) {
        ob_clean();
        echo json_encode([
            'success' => true,
            'data' => [
                'total_demos' => 0,
                'by_business_type' => [],
                'by_order_volume' => [],
                'recent_challenges' => []
            ]
        ]);
        exit;
    }

    // Calcular o total geral
    $totalQuery = $pdo->query("SELECT COUNT(*) as total FROM book_demo_requests");
    $totalDemos = $totalQuery->fetch()['total'] ?? 0;

    // Estatísticas de Demo por Tipo de Negócio
    $bizTypeQuery = $pdo->query("SELECT business_type, COUNT(*) as count FROM book_demo_requests GROUP BY business_type ORDER BY count DESC");
    $byBusinessType = $bizTypeQuery->fetchAll();

    // Volume financeiro e de encomendas indicativo por Grupo
    $volumeQuery = $pdo->query("SELECT order_volume, COUNT(*) as count FROM book_demo_requests GROUP BY order_volume ORDER BY count DESC");
    $byOrderVolume = $volumeQuery->fetchAll();

    // Últimos problemas / Desafios detalhados declarados pelos clientes
    $challengesQuery = $pdo->query("SELECT name, business_type, challenge, order_management, submitted_at FROM book_demo_requests ORDER BY id DESC LIMIT 15");
    $recentChallenges = $challengesQuery->fetchAll();

    ob_clean();
    echo json_encode([
        'success' => true,
        'data' => [
            'total_demos' => (int)$totalDemos,
            'by_business_type' => $byBusinessType,
            'by_order_volume' => $byOrderVolume,
            'recent_challenges' => $recentChallenges
        ]
    ]);
    exit;
} catch (PDOException $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro interno ao consultar dados para o dashboard.',
        'debug'   => $e->getMessage()
    ]);
    exit;
}
