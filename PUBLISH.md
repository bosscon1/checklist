# Workflow: local in Cursor → ZIP → SiteGround

## Daily use (see the checklist in Cursor)

```bash
cd web
pnpm install   # first time only
pnpm dev
```

Open the URL the terminal prints (or **http://127.0.0.1:8080/checklist/**).  
For local testing, set in the shell or a `.env` file under `web/`:

- `CHECKLIST_OWNER_SECRET` — same value you use as the phone “owner key”
- `CHECKLIST_BOT_TOKEN` — for bot API tests

Without those, the UI loads but the API returns “not configured.”

## When you’re ready to publish

From the **repo root**:

```bash
npm run publish:zip
```

This creates **`checklist-publish.zip`** in the repo root.

### Upload to SiteGround

1. **Site Tools → brianselleck.com → File Manager → `public_html`**
2. Upload **`checklist-publish.zip`**
3. **Extract** (merge with existing files)
4. **Do not overwrite** **`api/checklist/config.php`** if it’s already there (MySQL + tokens).
5. Visit **https://brianselleck.com/checklist/**

GitHub auto-deploy via Node.js is **not** used for this site; the ZIP is the publish path.
