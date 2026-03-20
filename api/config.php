<?php
// =============================================================================
// config.php — Carrega as variáveis de ambiente do ficheiro .env
// =============================================================================

$envPath = __DIR__ . '/.env';

if (!file_exists($envPath)) {
    throw new RuntimeException('Ficheiro .env não encontrado em: ' . $envPath);
}

$env = parse_ini_file($envPath, false, INI_SCANNER_RAW);

if ($env === false) {
    throw new RuntimeException('Não foi possível ler o ficheiro .env.');
}

// Base de dados
define('DB_HOST',    $env['DB_HOST']    ?? '127.0.0.1');
define('DB_PORT',    $env['DB_PORT']    ?? '3306');
define('DB_NAME',    $env['DB_NAME']    ?? 'sellex');
define('DB_USER',    $env['DB_USER']    ?? 'root');
define('DB_PASS',    $env['DB_PASS']    ?? '');
define('DB_CHARSET', $env['DB_CHARSET'] ?? 'utf8mb4');

// Email
define('MAIL_FROM_NAME',  $env['MAIL_FROM_NAME']  ?? 'Sellex');
define('MAIL_FROM_EMAIL', $env['MAIL_FROM_EMAIL']  ?? 'kinamukumba@gmail.com');
define('WHATSAPP_URL',    $env['WHATSAPP_URL']     ?? '');