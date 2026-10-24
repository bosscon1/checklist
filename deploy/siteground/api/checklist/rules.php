<?php
declare(strict_types=1);

function checklist_normalize_text(string $input): string {
    $trimmed = preg_replace('/\s+/u', ' ', trim($input));
    return $trimmed ?? '';
}

/** @return array{ok:true,text:string}|array{ok:false,error:string} */
function checklist_parse_text(mixed $input): array {
    if (!is_string($input)) {
        return ['ok' => false, 'error' => 'Text is required.'];
    }
    $text = checklist_normalize_text($input);
    if ($text === '') {
        return ['ok' => false, 'error' => 'Text is required.'];
    }
    if (mb_strlen($text) > 280) {
        return ['ok' => false, 'error' => 'Keep it under 280 characters.'];
    }
    return ['ok' => true, 'text' => $text];
}

/** @return array{ok:true,key:string}|array{ok:false,error:string} */
function checklist_parse_bot_key(mixed $input): array {
    if (!is_string($input)) {
        return ['ok' => false, 'error' => 'A stable key is required.'];
    }
    $key = trim($input);
    if ($key === '' || strlen($key) > 80 || preg_match('/\s/', $key)) {
        return ['ok' => false, 'error' => 'Key must be 1–80 characters with no spaces.'];
    }
    return ['ok' => true, 'key' => $key];
}

function checklist_is_status(mixed $value): bool {
    return is_string($value) && in_array($value, ['open', 'done', 'dismissed'], true);
}

/**
 * @param array{status:string,text:string} $item
 * @param array{text?:string,status?:string} $patch
 * @return array{ok:true,text?:string,status?:string,status_source?:string}|array{ok:false,status:int,error:string}
 */
function checklist_apply_user_patch(array $item, array $patch): array {
    $next = [];
    if (array_key_exists('text', $patch)) {
        $parsed = checklist_parse_text($patch['text']);
        if (!$parsed['ok']) {
            return ['ok' => false, 'status' => 400, 'error' => $parsed['error']];
        }
        if ($parsed['text'] !== $item['text']) {
            $next['text'] = $parsed['text'];
        }
    }
    if (array_key_exists('status', $patch)) {
        if (!checklist_is_status($patch['status'])) {
            return ['ok' => false, 'status' => 400, 'error' => 'Status must be open, done, or dismissed.'];
        }
        if ($patch['status'] !== $item['status']) {
            $next['status'] = $patch['status'];
            $next['status_source'] = 'user';
        }
    }
    if ($next === []) {
        return ['ok' => true];
    }
    return ['ok' => true, ...$next];
}

/**
 * @param array{status:string,text:string} $item
 * @param array{text?:string,status?:string} $patch
 */
function checklist_apply_bot_patch(array $item, array $patch): array {
    if (isset($patch['status']) && $patch['status'] !== 'done') {
        return ['ok' => false, 'status' => 400, 'error' => 'The bot can only mark an open item done.'];
    }
    if ($item['status'] === 'dismissed') {
        return ['ok' => false, 'status' => 409, 'error' => 'Dismissed items stay dismissed.'];
    }
    if (($patch['status'] ?? null) === 'done' && $item['status'] === 'done' && !isset($patch['text'])) {
        return ['ok' => true];
    }
    if (isset($patch['text']) && $item['status'] !== 'open') {
        return ['ok' => false, 'status' => 409, 'error' => 'Only open items can be reworded.'];
    }
    if (($patch['status'] ?? null) === 'done' && $item['status'] !== 'open') {
        return ['ok' => false, 'status' => 409, 'error' => 'Only an open item can be marked done.'];
    }
    $next = [];
    if (isset($patch['text'])) {
        $parsed = checklist_parse_text($patch['text']);
        if (!$parsed['ok']) {
            return ['ok' => false, 'status' => 400, 'error' => $parsed['error']];
        }
        if ($parsed['text'] !== $item['text']) {
            $next['text'] = $parsed['text'];
        }
    }
    if (($patch['status'] ?? null) === 'done' && $item['status'] === 'open') {
        $next['status'] = 'done';
        $next['status_source'] = 'bot';
    }
    if ($next === []) {
        return ['ok' => true];
    }
    return ['ok' => true, ...$next];
}
