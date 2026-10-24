# SiteGround GitHub deploy (Node.js tool)

The checklist on **brianselleck.com** is **PHP + static HTML**, not a long-running Node server. SiteGround’s GitHub connector still expects a root **`package.json`**; **`npm run build`** copies **`deploy/siteground`** into **`public/`**.

## After you push to GitHub

In **Site Tools → Node.js → your app → Deployment options → REVIEW SETTINGS** (or Actions → edit settings):

| Setting | Value |
|---------|--------|
| **Build command** | `npm run build` |
| **Output directory** | `public` |
| **Package manager** | npm |
| **Node version** | 22 (or default) |

Redeploy (or push again to `main`).

## Keep `config.php` on the server

Git deploy **must not** overwrite **`public/api/checklist/config.php`** with secrets. Either:

- Add **`config.php`** only on the server (never in GitHub), or  
- Use SiteGround **environment variables** later and we can adjust PHP to read them.

If a deploy wipes `config.php`, upload it again via File Manager.

## If PHP still does not run

Some **Node.js** deploy targets serve static files only. If **`/api/checklist/`** fails after a successful build, upload **`deploy/siteground`** via **File Manager → `public_html`** instead (see **`deploy/siteground/README.md`**).
