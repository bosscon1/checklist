<?php
declare(strict_types=1);

function checklist_config(): array {
    static $cfg = null;
    if ($cfg !== null) {
        return $cfg;
    }
    $path = __DIR__ . '/config.php';
    if (!is_readable($path)) {
        http_response_code(503);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Checklist config.php is missing.']);
        exit;
    }
    $loaded = require $path;
    if (!is_array($loaded)) {
        http_response_code(503);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Checklist config.php must return an array.']);
        exit;
    }
    $cfg = $loaded;
    return $cfg;
}

function checklist_pdo(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $c = checklist_config();
    $host = $c['mysql_host'] ?? 'localhost';
    $port = (int) ($c['mysql_port'] ?? 3306);
    $db = $c['mysql_database'] ?? '';
    $user = $c['mysql_user'] ?? '';
    $pass = $c['mysql_password'] ?? '';
    if ($db === '' || $user === '') {
        throw new RuntimeException('MySQL is not configured in config.php.');
    }
    $dsn = "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}

function checklist_json(mixed $body, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function checklist_bearer(): string {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Bearer\s+(\S+)\s*$/i', $header, $m)) {
        return $m[1];
    }
    return '';
}

function checklist_token_matches(string $provided, string $expected): bool {
    if ($expected === '') {
        return false;
    }
    return hash_equals(hash('sha256', $provided), hash('sha256', $expected));
}

function checklist_authorize_owner(): ?never {
    $secret = trim((string) (checklist_config()['checklist_owner_secret'] ?? ''));
    if ($secret === '') {
        checklist_json(['error' => 'Checklist auth is not configured.'], 503);
    }
    if (!checklist_token_matches(checklist_bearer(), $secret)) {
        checklist_json(['error' => 'Unauthorized.'], 401);
    }
    return null;
}

function checklist_authorize_bot(): ?never {
    $secret = trim((string) (checklist_config()['checklist_bot_token'] ?? ''));
    if ($secret === '') {
        checklist_json(['error' => 'Checklist auth is not configured.'], 503);
    }
    if (!checklist_token_matches(checklist_bearer(), $secret)) {
        checklist_json(['error' => 'Unauthorized.'], 401);
    }
    return null;
}

function checklist_read_json(): array {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        checklist_json(['error' => 'Expected a JSON object.'], 400);
    }
    $body = json_decode($raw, true);
    if (!is_array($body)) {
        checklist_json(['error' => 'Expected a JSON object.'], 400);
    }
    return $body;
}

function checklist_uuid_v4(): string {
    $bytes = random_bytes(16);
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    $hex = bin2hex($bytes);
    return substr($hex, 0, 8) . '-' . substr($hex, 8, 4) . '-' . substr($hex, 12, 4) . '-'
        . substr($hex, 16, 4) . '-' . substr($hex, 20, 12);
}

function checklist_iso(?string $value): string {
    if ($value === null || $value === '') {
        return gmdate('c');
    }
    $ts = strtotime($value);
    if ($ts === false) {
        return $value;
    }
    return gmdate('c', $ts);
}

/** @param array<string, mixed> $row */
function checklist_row_to_item(array $row): array {
    return [
        'id' => (string) $row['id'],
        'text' => (string) $row['body'],
        'status' => (string) $row['status'],
        'source' => (string) $row['source'],
        'statusSource' => (string) $row['status_source'],
        'botKey' => $row['bot_key'] !== null ? (string) $row['bot_key'] : null,
        'createdAt' => checklist_iso(isset($row['created_at']) ? (string) $row['created_at'] : null),
        'updatedAt' => checklist_iso(isset($row['updated_at']) ? (string) $row['updated_at'] : null),
    ];
}

require __DIR__ . '/rules.php';
require __DIR__ . '/store.php';
