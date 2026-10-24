<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$id = $_GET['id'] ?? '';
if (!preg_match('/^[0-9a-f-]{36}$/i', $id)) {
    checklist_json(['error' => 'Invalid item id.'], 400);
}

try {
    if ($method === 'PATCH') {
        checklist_authorize_owner();
        $body = checklist_read_json();
        $patch = [];
        if (array_key_exists('text', $body)) {
            $patch['text'] = is_string($body['text']) ? $body['text'] : '';
        }
        if (array_key_exists('status', $body)) {
            $patch['status'] = $body['status'];
        }
        if ($patch === []) {
            checklist_json(['error' => 'Nothing to change.'], 400);
        }
        $result = checklist_patch_user_item($id, $patch);
        if (!$result['ok']) {
            checklist_json(['error' => $result['error']], $result['status']);
        }
        checklist_json(['item' => $result['item']]);
    }
    checklist_json(['error' => 'Method not allowed.'], 405);
} catch (Throwable $e) {
    error_log('[checklist] ' . $e->getMessage());
    checklist_json(['error' => 'Couldn\'t update the checklist.'], 500);
}
