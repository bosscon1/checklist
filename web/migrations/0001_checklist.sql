create table if not exists checklist_items (
  id text primary key,
  body text not null,
  status text not null,
  source text not null,
  status_source text not null,
  bot_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint checklist_items_status_check check (status in ('open', 'done', 'dismissed')),
  constraint checklist_items_source_check check (source in ('user', 'bot')),
  constraint checklist_items_status_source_check check (status_source in ('user', 'bot'))
);

create unique index if not exists checklist_items_bot_key_unique
  on checklist_items (bot_key)
  where bot_key is not null;
