<?php
// config.php
// Carrega as variáveis de ambiente do arquivo .env

$envPath = __DIR__ . '/.env';
if (!file_exists($envPath)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Arquivo .env não encontrado.']);
    exit;
}

$env = parse_ini_file($envPath, false, INI_SCANNER_RAW);
if ($env === false) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Não foi possível ler .env.']);
    exit;
}

define('DB_HOST', $env['DB_HOST'] ?? '127.0.0.1');
define('DB_NAME', $env['DB_NAME'] ?? 'sellex');
define('DB_USER', $env['DB_USER'] ?? 'root');
define('DB_PASS', $env['DB_PASS'] ?? '');
define('DB_CHARSET', $env['DB_CHARSET'] ?? 'utf8mb4');
