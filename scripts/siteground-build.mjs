#!/usr/bin/env node
/**
 * SiteGround GitHub / Node deploy: copy the PHP + static checklist site
 * into ./public (set "output directory" to public in deployment settings).
 */
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "deploy", "siteground");
const out = join(root, "public");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const name of ["api", "checklist", "checklist-sw.js"]) {
  cpSync(join(src, name), join(out, name), { recursive: true });
}

console.log("[siteground-build] Wrote checklist site to public/");
