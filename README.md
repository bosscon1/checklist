# Checklist

Phone-friendly personal checklist with a Grok bot integration. The web app lives in `web/`; copy the bot tools from `bot/` into your Agent SDK project.

## Web app

```bash
cd web
pnpm install
pnpm dev
```

Open `/checklist/` (the home page redirects there). Set these environment variables in production:

- `CHECKLIST_OWNER_SECRET` — bearer token for the phone UI and owner API
- `CHECKLIST_BOT_TOKEN` — bearer token for the bot API (`/api/checklist/bot`)
- `DATABASE_URL` — optional Postgres/Neon URL; without it, local dev uses embedded PGLite

## Grok bot

Copy into your bot project:

- `bot/tools/list_checklist.ts`
- `bot/tools/update_checklist.ts`
- `bot/lib/checklist-api.ts`

Set:

- `CHECKLIST_API_URL` — e.g. `https://your-host.example/api/checklist/bot`
- `CHECKLIST_BOT_TOKEN` — same value as on the web host

## Origin

This repo was split out of [bosscon1/pfeifer-com](https://github.com/bosscon1/pfeifer-com) branch `cursor/phone-checklist-c00d` so the Pfeifer website stays separate.
