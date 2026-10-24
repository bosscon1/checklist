<?php
declare(strict_types=1);

function checklist_list_items(): array {
    $pdo = checklist_pdo();
    $stmt = $pdo->query(
        'SELECT id, body, status, source, status_source, bot_key, created_at, updated_at
         FROM checklist_items
         ORDER BY FIELD(status, \'open\', \'done\', \'dismissed\'), created_at ASC',
    );
    $items = [];
    foreach ($stmt->fetchAll() as $row) {
        $items[] = checklist_row_to_item($row);
    }
    return $items;
}

function checklist_get_item(string $id): ?array {
    $pdo = checklist_pdo();
    $stmt = $pdo->prepare(
        'SELECT id, body, status, source, status_source, bot_key, created_at, updated_at
         FROM checklist_items WHERE id = ? LIMIT 1',
    );
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ? checklist_row_to_item($row) : null;
}

function checklist_get_by_bot_key(string $key): ?array {
    $pdo = checklist_pdo();
    $stmt = $pdo->prepare(
        'SELECT id, body, status, source, status_source, bot_key, created_at, updated_at
         FROM checklist_items WHERE bot_key = ? LIMIT 1',
    );
    $stmt->execute([$key]);
    $row = $stmt->fetch();
    return $row ? checklist_row_to_item($row) : null;
}

function checklist_insert_item(string $text, string $source, ?string $botKey): array {
    $pdo = checklist_pdo();
    $id = checklist_uuid_v4();
    $stmt = $pdo->prepare(
        'INSERT INTO checklist_items (id, body, status, source, status_source, bot_key)
         VALUES (?, ?, \'open\', ?, ?, ?)',
    );
    $stmt->execute([$id, $text, $source, $source, $botKey]);
    $item = checklist_get_item($id);
    if ($item === null) {
        throw new RuntimeException('Insert failed.');
    }
    return $item;
}

function checklist_add_user_item(string $text): array {
    return checklist_insert_item($text, 'user', null);
}

/** @return array{item:array,created:bool} */
function checklist_add_bot_item(string $text, string $key): array {
    $existing = checklist_get_by_bot_key($key);
    if ($existing !== null) {
        return ['item' => $existing, 'created' => false];
    }
    try {
        return ['item' => checklist_insert_item($text, 'bot', $key), 'created' => true];
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            $again = checklist_get_by_bot_key($key);
            if ($again !== null) {
                return ['item' => $again, 'created' => false];
            }
        }
        throw $e;
    }
}

/**
 * @param array{text?:string,status?:string,status_source?:string} $change
 */
function checklist_write_item(array $item, array $change, bool $onlyIfOpen): ?array {
    $pdo = checklist_pdo();
    $text = $change['text'] ?? $item['text'];
    $status = $change['status'] ?? $item['status'];
    $statusSource = $change['status_source'] ?? $item['statusSource'];
    if ($onlyIfOpen) {
        $stmt = $pdo->prepare(
            'UPDATE checklist_items
             SET body = ?, status = ?, status_source = ?, updated_at = CURRENT_TIMESTAMP(6)
             WHERE id = ? AND status = \'open\'',
        );
    } else {
        $stmt = $pdo->prepare(
            'UPDATE checklist_items
             SET body = ?, status = ?, status_source = ?, updated_at = CURRENT_TIMESTAMP(6)
             WHERE id = ?',
        );
    }
    $stmt->execute([$text, $status, $statusSource, $item['id']]);
    if ($stmt->rowCount() === 0) {
        return null;
    }
    return checklist_get_item($item['id']);
}

/** @param array{text?:string,status?:string} $patch */
function checklist_patch_user_item(string $id, array $patch): array {
    $item = checklist_get_item($id);
    if ($item === null) {
        return ['ok' => false, 'status' => 404, 'error' => 'That item is gone.'];
    }
    $change = checklist_apply_user_patch(['status' => $item['status'], 'text' => $item['text']], $patch);
    if (!$change['ok']) {
        return ['ok' => false, 'status' => $change['status'], 'error' => $change['error']];
    }
    unset($change['ok']);
    if ($change === []) {
        return ['ok' => true, 'item' => $item];
    }
    $mapped = [];
    if (isset($change['text'])) {
        $mapped['text'] = $change['text'];
    }
    if (isset($change['status'])) {
        $mapped['status'] = $change['status'];
    }
    if (isset($change['status_source'])) {
        $mapped['status_source'] = $change['status_source'];
    }
    $saved = checklist_write_item($item, $mapped, false);
    if ($saved === null) {
        return ['ok' => false, 'status' => 404, 'error' => 'That item is gone.'];
    }
    return ['ok' => true, 'item' => $saved];
}

/** @param array{text?:string,status?:string} $patch */
function checklist_patch_bot_item(string $id, array $patch): array {
    $item = checklist_get_item($id);
    if ($item === null) {
        return ['ok' => false, 'status' => 404, 'error' => 'That item is gone.'];
    }
    $change = checklist_apply_bot_patch(['status' => $item['status'], 'text' => $item['text']], $patch);
    if (!$change['ok']) {
        return ['ok' => false, 'status' => $change['status'], 'error' => $change['error']];
    }
    unset($change['ok']);
    if ($change === []) {
        return ['ok' => true, 'item' => $item];
    }
    $mapped = [];
    if (isset($change['text'])) {
        $mapped['text'] = $change['text'];
    }
    if (isset($change['status'])) {
        $mapped['status'] = $change['status'];
    }
    if (isset($change['status_source'])) {
        $mapped['status_source'] = $change['status_source'];
    }
    $saved = checklist_write_item($item, $mapped, true);
    if ($saved !== null) {
        return ['ok' => true, 'item' => $saved];
    }
    $latest = checklist_get_item($id);
    if ($latest === null) {
        return ['ok' => false, 'status' => 404, 'error' => 'That item is gone.'];
    }
    return ['ok' => true, 'item' => $latest];
}
