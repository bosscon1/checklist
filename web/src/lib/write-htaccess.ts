import { readFileSync, writeFileSync } from "node:fs";

const HTACCESS = "/workspace/public/.htaccess";
const START = "# BEGIN PFEIFER ADMIN REDIRECTS";
const END = "# END PFEIFER ADMIN REDIRECTS";

export function writeAdminRedirectsToHtaccess(rows: { from: string; to: string }[]): string {
  let current = "";
  try {
    current = readFileSync(HTACCESS, "utf8");
  } catch {
    return "Could not read the SiteGround redirect file.";
  }

  const block = [
    START,
    "# Written from Site admin. One path, one live page. Do not chain.",
    ...rows
      .filter((r) => r.from && r.to && r.from !== r.to)
      .map((r) => `Redirect 301 ${r.from} ${r.to}`),
    END,
    "",
  ].join("\n");

  let next: string;
  if (current.includes(START) && current.includes(END)) {
    next = current.replace(new RegExp(`${START}[\\s\\S]*?${END}\\n?`), `${block}\n`);
  } else {
    next = `${current.trimEnd()}\n\n${block}\n`;
  }

  try {
    writeFileSync(HTACCESS, next);
    return `Updated the SiteGround 301 file with ${rows.length} published redirects.`;
  } catch {
    return "Saved in admin, but this host could not write the SiteGround file. Copy the list at cutover.";
  }
}
