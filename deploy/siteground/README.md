# Upload checklist to brianselleck.com (SiteGround)

You already created the MySQL table and `api/checklist/config.php`. Finish with these steps.

## 1. Add two secrets to `config.php`

Open **File Manager → api/checklist/config.php** and add two lines (use long random passwords — different from each other and from MySQL):

```php
    'checklist_owner_secret' => 'pick-a-long-random-phone-key',
    'checklist_bot_token' => 'pick-a-different-bot-token',
```

You will type the **owner secret** once on your phone as the “owner key”. The **bot token** goes in Grok later, not on the phone.

## 2. Upload these folders to your site root

In **File Manager**, open the folder that serves **brianselleck.com** (usually `public_html`).

Upload **from this `deploy/siteground` folder**:

| Upload this | Into site root as |
|-------------|-------------------|
| `api/checklist/` (all PHP files **except** do not overwrite your `config.php`) | `api/checklist/` |
| `checklist/` folder | `checklist/` |
| `checklist-sw.js` | `checklist-sw.js` (same level as `checklist/`) |

**Do not delete** your existing `config.php`. Only upload the new `.php` files, `.htaccess`, and `config.sample.php`.

## 3. Test in the browser

1. Visit **https://brianselleck.com/checklist/**
2. Enter the **owner secret** you put in `config.php`
3. Add a test item — then check **phpMyAdmin → checklist_items** for a new row

## 4. Grok bot (later)

- `CHECKLIST_API_URL` = `https://brianselleck.com/api/checklist/bot`
- `CHECKLIST_BOT_TOKEN` = same as `checklist_bot_token` in `config.php`

Copy the `bot/` tools from the main repo into your Grok project when you are ready.
