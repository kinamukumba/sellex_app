<?php
// book_demo.php
// Endpoint para receber dados do formulário de agendamento de demo

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não autorizado. Use POST.']);
    exit;
}

require_once __DIR__ . '/db.php';

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'JSON inválido ou ausente.']);
    exit;
}

$fields = [
    'name' => 'Nome completo',
    'email' => 'Email',
    'phone' => 'Telefone',
    'business_type' => 'Tipo de negócio',
    'order_management' => 'Gestão de pedidos',
    'order_volume' => 'Volume de pedidos',
    'challenge' => 'Desafio',
];

$errors = [];
foreach ($fields as $key => $label) {
    if (empty(trim((string)($data[$key] ?? '')))) {
        $errors[] = "Campo '{$label}' é obrigatório.";
    }
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Validação falhou.', 'errors' => $errors]);
    exit;
}

try {
    $pdo = getPDO();

    $pdo->exec("CREATE TABLE IF NOT EXISTS book_demo_requests (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        business_type VARCHAR(100) NOT NULL,
        order_management VARCHAR(100) NOT NULL,
        order_volume VARCHAR(100) NOT NULL,
        challenge TEXT NOT NULL,
        source_url VARCHAR(255) DEFAULT NULL,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $stmt = $pdo->prepare("INSERT INTO book_demo_requests (name, email, phone, business_type, order_management, order_volume, challenge, source_url, submitted_at) VALUES (:name, :email, :phone, :business_type, :order_management, :order_volume, :challenge, :source_url, :submitted_at)");

    $stmt->execute([
        ':name' => trim($data['name']),
        ':email' => trim($data['email']),
        ':phone' => trim($data['phone']),
        ':business_type' => trim($data['business_type']),
        ':order_management' => trim($data['order_management']),
        ':order_volume' => trim($data['order_volume']),
        ':challenge' => trim($data['challenge']),
        ':source_url' => trim((string)($data['source_url'] ?? '')),
        ':submitted_at' => date('Y-m-d H:i:s', strtotime($data['submitted_at'] ?? 'now')),
    ]);

    echo json_encode(['success' => true, 'message' => 'Book demo recebido com sucesso.']);
    exit;
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao gravar dados de demo.', 'error' => $e->getMessage()]);
    exit;
}
