<?php
// =============================================================================
// db.php — Ligação PDO reutilizável (padrão singleton)
// =============================================================================

require_once __DIR__ . '/config.php';

/**
 * Devolve sempre a mesma instância PDO (singleton).
 * Lança PDOException em caso de falha — o caller trata o erro.
 *
 * @throws PDOException
 * @return PDO
 */
function getPDO(): PDO
{
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        DB_HOST,
        DB_PORT,
        DB_NAME,
        DB_CHARSET
    );

    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    return $pdo;
}