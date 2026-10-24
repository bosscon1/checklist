<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    if ($method === 'GET') {
        checklist_authorize_owner();
        checklist_json(['items' => checklist_list_items()]);
    }
    if ($method === 'POST') {
        checklist_authorize_owner();
        $body = checklist_read_json();
        $parsed = checklist_parse_text($body['text'] ?? null);
        if (!$parsed['ok']) {
            checklist_json(['error' => $parsed['error']], 400);
        }
        checklist_json(['item' => checklist_add_user_item($parsed['text'])], 201);
    }
    checklist_json(['error' => 'Method not allowed.'], 405);
} catch (Throwable $e) {
    error_log('[checklist] ' . $e->getMessage());
    checklist_json(['error' => 'Couldn\'t update the checklist.'], 500);
}
