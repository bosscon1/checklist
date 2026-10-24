#!/usr/bin/env node
/**
 * Build SiteGround publish ZIP for manual upload to brianselleck.com public_html.
 * Does not include config.php (secrets stay on the server only).
 */
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const staging = join(root, ".publish-staging");
const zipPath = join(root, "checklist-publish.zip");

rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });

execSync("node scripts/siteground-build.mjs", { cwd: root, stdio: "inherit" });

const publicDir = join(root, "public");
for (const name of ["api", "checklist", "checklist-sw.js"]) {
  cpSync(join(publicDir, name), join(staging, name), { recursive: true });
}

const configOnServer = join(staging, "api/checklist/config.php");
rmSync(configOnServer, { force: true });

mkdirSync(join(staging, "api/checklist"), { recursive: true });
cpSync(
  join(root, "deploy/siteground/api/checklist/config.sample.php"),
  join(staging, "api/checklist/config.sample.php"),
);

writeFileSync(
  join(staging, "UPLOAD-README.txt"),
  `Publish checklist to brianselleck.com
================================

1. SiteGround → File Manager → public_html for brianselleck.com
2. Upload this ZIP and Extract here (merge/replace files).
3. Do NOT replace api/checklist/config.php if it already exists on the server.
4. Open https://brianselleck.com/checklist/

If config.php is missing, copy config.sample.php to config.php and fill in MySQL + tokens.
`,
  "utf8",
);

rmSync(zipPath, { force: true });
execSync(`zip -r "${zipPath}" .`, { cwd: staging, stdio: "inherit" });

rmSync(staging, { recursive: true, force: true });

console.log(`\n[publish] Wrote ${zipPath}`);
console.log("[publish] Upload and extract in public_html on brianselleck.com.");
