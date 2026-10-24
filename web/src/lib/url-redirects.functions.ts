import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { assertStaffUser } from "@/lib/assert-staff";
import {
  WORDPRESS_CANDIDATES,
  SEEDED_REDIRECTS,
  isHiddenPath,
  listLivePaths,
  normalizePath,
  parseSitemapLocs,
  suggestDestination,
} from "@/lib/url-paths";
import { writeAdminRedirectsToHtaccess } from "@/lib/write-htaccess";

export type RedirectRow = {
  id: number;
  fromPath: string;
  toPath: string | null;
  suggestedTo: string | null;
  status: "detected" | "ignored" | "ready" | "published";
  source: string;
  note: string;
  updatedAt: string;
};

type DbRow = {
  id: number;
  from_path: string;
  to_path: string | null;
  suggested_to: string | null;
  status: RedirectRow["status"];
  source: string;
  note: string;
  updated_at: string | Date;
};

function fromDb(row: DbRow): RedirectRow {
  return {
    id: Number(row.id),
    fromPath: row.from_path,
    toPath: row.to_path,
    suggestedTo: row.suggested_to,
    status: row.status,
    source: row.source,
    note: row.note,
    updatedAt: String(row.updated_at),
  };
}

async function listRows(): Promise<RedirectRow[]> {
  const sql = await getSql();
  const rows = await sql<DbRow>`
    select id, from_path, to_path, suggested_to, status, source, note, updated_at
    from url_redirects
    order by
      case status
        when 'detected' then 0
        when 'ready' then 1
        when 'published' then 2
        else 3
      end,
      from_path
  `;
  return rows.map(fromDb);
}

async function upsertPath(opts: {
  fromPath: string;
  toPath: string | null;
  suggestedTo: string | null;
  status: RedirectRow["status"];
  source: string;
  note: string;
  userId: string;
}) {
  const sql = await getSql();
  await sql`
    insert into url_redirects (
      from_path, to_path, suggested_to, status, source, note, updated_at, updated_by
    ) values (
      ${opts.fromPath},
      ${opts.toPath},
      ${opts.suggestedTo},
      ${opts.status},
      ${opts.source},
      ${opts.note},
      now(),
      ${opts.userId}
    )
    on conflict (from_path) do update set
      suggested_to = excluded.suggested_to,
      note = excluded.note,
      updated_at = now(),
      updated_by = excluded.updated_by,
      status = case
        when url_redirects.status in ('published', 'ignored', 'ready') then url_redirects.status
        else excluded.status
      end,
      to_path = coalesce(url_redirects.to_path, excluded.to_path)
  `;
}

export const listUrlRedirects = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertStaffUser(context.userId);
    return {
      livePaths: listLivePaths(),
      rows: await listRows(),
    };
  });

export const lookupPublishedRedirect = createServerFn({ method: "GET" })
  .validator(z.object({ path: z.string().min(1).max(300) }))
  .handler(async ({ data }) => {
    const path = normalizePath(data.path);
    if (isHiddenPath(path)) return null;
    const sql = await getSql();
    const rows = await sql<{ to_path: string | null }>`
      select to_path from url_redirects
      where from_path = ${path} and status = 'published' and to_path is not null
      limit 1
    `;
    const dest = rows[0]?.to_path;
    if (!dest || dest === path) return null;
    return dest;
  });

export const compareUrlRedirects = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertStaffUser(context.userId);
    const live = listLivePaths();
    const liveSet = new Set(live);
    let liveSitemapCount = 0;
    let sitemapNote = "Live WordPress sitemap was blocked. Compared known leftovers to this rebuild.";

    const fetched = new Set<string>();
    for (const url of [
      "https://pfeiferbuild.com/sitemap.xml",
      "https://pfeiferbuild.com/wp-sitemap.xml",
      "https://pfeiferbuild.com/sitemap_index.xml",
      "https://pfeiferbuild.com/page-sitemap.xml",
      "https://pfeiferbuild.com/post-sitemap.xml",
    ]) {
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "PfeiferRebuild/1.0" },
          signal: AbortSignal.timeout(8000),
        });
        const text = await res.text();
        if (res.ok && text.includes("<loc")) {
          for (const loc of parseSitemapLocs(text)) fetched.add(loc);
        }
      } catch {
        /* SiteGround may challenge this host */
      }
    }
    if (fetched.size > 0) {
      liveSitemapCount = fetched.size;
      sitemapNote = `Read ${fetched.size} URLs from the live WordPress sitemap.`;
    }

    const candidates = new Set<string>([
      ...WORDPRESS_CANDIDATES.map(normalizePath),
      ...SEEDED_REDIRECTS.map((r) => normalizePath(r.from)),
      ...fetched,
    ]);

    for (const seed of SEEDED_REDIRECTS) {
      const from = normalizePath(seed.from);
      const to = normalizePath(seed.to);
      await upsertPath({
        fromPath: from,
        toPath: to,
        suggestedTo: to,
        status: "published",
        source: "htaccess",
        note: "Already in the SiteGround 301 file.",
        userId: context.userId,
      });
    }

    let added = 0;
    for (const raw of candidates) {
      const from = normalizePath(raw);
      if (from === "/" || isHiddenPath(from) || liveSet.has(from)) continue;
      if (SEEDED_REDIRECTS.some((r) => normalizePath(r.from) === from)) continue;
      const suggested = suggestDestination(from, live);
      await upsertPath({
        fromPath: from,
        toPath: null,
        suggestedTo: suggested,
        status: "detected",
        source: fetched.has(from) ? "wordpress-sitemap" : "compare",
        note: suggested
          ? `Suggested ${suggested}. Confirm before publish.`
          : "No safe match. Pick a live page — do not send this to home unless you mean to.",
        userId: context.userId,
      });
      added += 1;
    }

    return {
      note: sitemapNote,
      liveCount: live.length,
      liveSitemapCount,
      rows: await listRows(),
      scanned: candidates.size,
      added,
    };
  });

export const addManualRedirect = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ path: z.string().min(1).max(300) }))
  .handler(async ({ data, context }) => {
    await assertStaffUser(context.userId);
    const from = normalizePath(data.path);
    if (from === "/" || isHiddenPath(from)) {
      throw new Error("That path is reserved.");
    }
    const live = listLivePaths();
    if (live.includes(from)) {
      throw new Error("That path is already a live page.");
    }
    const suggested = suggestDestination(from, live);
    await upsertPath({
      fromPath: from,
      toPath: null,
      suggestedTo: suggested,
      status: "detected",
      source: "manual",
      note: "Added by hand.",
      userId: context.userId,
    });
    return listRows();
  });

export const updateUrlRedirect = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.number(),
      toPath: z.string().max(300).nullable(),
      status: z.enum(["detected", "ignored", "ready", "published"]).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    await assertStaffUser(context.userId);
    const live = new Set(listLivePaths());
    const sql = await getSql();
    const current = await sql<DbRow>`
      select id, from_path, to_path, suggested_to, status, source, note, updated_at
      from url_redirects where id = ${data.id} limit 1
    `;
    const row = current[0];
    if (!row) throw new Error("Row not found.");
    let toPath = data.toPath === null ? null : data.toPath ? normalizePath(data.toPath) : row.to_path;
    if (toPath) {
      if (!live.has(toPath)) throw new Error("Destination must be a live page on this site.");
      if (toPath === row.from_path) throw new Error("A path cannot redirect to itself.");
    }
    let status = data.status ?? row.status;
    if (status === "published" && !toPath) throw new Error("Pick a live page before publishing.");
    if (toPath && status === "detected") status = "ready";
    await sql`
      update url_redirects
      set to_path = ${toPath},
          status = ${status},
          updated_at = now(),
          updated_by = ${context.userId}
      where id = ${data.id}
    `;
    return listRows();
  });

export const publishUrlRedirects = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertStaffUser(context.userId);
    const sql = await getSql();
    await sql`
      update url_redirects
      set status = 'published', updated_at = now(), updated_by = ${context.userId}
      where status = 'ready' and to_path is not null
    `;
    const published = await sql<{ from_path: string; to_path: string }>`
      select from_path, to_path from url_redirects
      where status = 'published' and to_path is not null and source <> 'htaccess'
      order by from_path
    `;
    const fileNote = writeAdminRedirectsToHtaccess(
      published.map((r) => ({ from: r.from_path, to: r.to_path })),
    );
    return { rows: await listRows(), fileNote };
  });
