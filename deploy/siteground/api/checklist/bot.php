<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    if ($method === 'GET') {
        checklist_authorize_bot();
        $key = $_GET['key'] ?? null;
        if ($key === null) {
            checklist_json(['items' => checklist_list_items()]);
        }
        $parsed = checklist_parse_bot_key($key);
        if (!$parsed['ok']) {
            checklist_json(['error' => $parsed['error']], 400);
        }
        $item = checklist_get_by_bot_key($parsed['key']);
        if ($item === null) {
            checklist_json(['error' => 'No item uses that key.'], 404);
        }
        checklist_json(['item' => $item]);
    }
    if ($method === 'POST') {
        checklist_authorize_bot();
        $body = checklist_read_json();
        $text = checklist_parse_text($body['text'] ?? null);
        if (!$text['ok']) {
            checklist_json(['error' => $text['error']], 400);
        }
        $key = checklist_parse_bot_key($body['key'] ?? null);
        if (!$key['ok']) {
            checklist_json(['error' => $key['error']], 400);
        }
        $result = checklist_add_bot_item($text['text'], $key['key']);
        checklist_json($result, $result['created'] ? 201 : 200);
    }
    checklist_json(['error' => 'Method not allowed.'], 405);
} catch (Throwable $e) {
    error_log('[checklist] ' . $e->getMessage());
    checklist_json(['error' => 'Couldn\'t update the checklist.'], 500);
}
