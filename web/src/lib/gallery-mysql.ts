import { readFileSync } from "node:fs";
import { join } from "node:path";
import mysql from "mysql2/promise";

export type GallerySettings = {
  featured?: string;
  order?: string[];
  overlay?: number;
  video?: string | null;
};

type MysqlCfg = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

let pool: mysql.Pool | null | undefined;
let ready = false;

function loadConfig(): MysqlCfg | null {
  const fromEnv = {
    host: process.env.MYSQL_HOST?.trim(),
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER?.trim(),
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE?.trim(),
  };
  if (fromEnv.host && fromEnv.user && fromEnv.password && fromEnv.database) {
    return { ...fromEnv, host: fromEnv.host, user: fromEnv.user, password: fromEnv.password, database: fromEnv.database };
  }
  try {
    const raw = JSON.parse(readFileSync(join(process.cwd(), ".grok/mysql.json"), "utf8")) as MysqlCfg;
    if (raw?.host && raw?.user && raw?.password && raw?.database) {
      return { host: raw.host, port: Number(raw.port || 3306), user: raw.user, password: raw.password, database: raw.database };
    }
  } catch {
    /* no local mysql config */
  }
  return null;
}

async function getPool(): Promise<mysql.Pool | null> {
  if (pool !== undefined) return pool;
  const cfg = loadConfig();
  if (!cfg) {
    pool = null;
    return null;
  }
  pool = mysql.createPool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    waitForConnections: true,
    connectionLimit: 3,
    enableKeepAlive: true,
    ssl: undefined,
    connectTimeout: 12000,
  });
  return pool;
}

async function ensureTable(db: mysql.Pool) {
  if (ready) return;
  await db.query(`
    create table if not exists gallery_settings (
      category varchar(64) not null primary key,
      featured varchar(180) null,
      sort_order json null,
      overlay tinyint not null default 55,
      video varchar(180) null,
      video_none tinyint not null default 0,
      updated_at timestamp not null default current_timestamp on update current_timestamp
    )
  `);
  ready = true;
}

function parseOrder(value: unknown): string[] | undefined {
  if (Array.isArray(value)) return value.filter((n) => typeof n === "string");
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed.filter((n) => typeof n === "string");
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export async function readGallerySettings(category: string): Promise<GallerySettings | null> {
  const db = await getPool();
  if (!db) return null;
  try {
    await ensureTable(db);
    const [rows] = await db.query<mysql.RowDataPacket[]>(
      `select featured, sort_order, overlay, video, video_none from gallery_settings where category = ? limit 1`,
      [category],
    );
    const row = rows[0];
    if (!row) return null;
    const overlay = Number(row.overlay);
    return {
      featured: typeof row.featured === "string" && row.featured ? row.featured : undefined,
      order: parseOrder(row.sort_order),
      overlay: Number.isFinite(overlay) ? overlay : undefined,
      video: Number(row.video_none) === 1 ? null : typeof row.video === "string" && row.video ? row.video : undefined,
    };
  } catch {
    return null;
  }
}

export async function writeGallerySettings(category: string, next: GallerySettings) {
  const db = await getPool();
  if (!db) return;
  await ensureTable(db);
  const videoNone = next.video === null ? 1 : 0;
  const video = next.video ? next.video : null;
  await db.query(
    `insert into gallery_settings (category, featured, sort_order, overlay, video, video_none)
     values (?, ?, ?, ?, ?, ?)
     on duplicate key update
       featured = values(featured),
       sort_order = values(sort_order),
       overlay = values(overlay),
       video = values(video),
       video_none = values(video_none)`,
    [
      category,
      next.featured ?? null,
      JSON.stringify(next.order ?? []),
      typeof next.overlay === "number" ? next.overlay : 55,
      video,
      videoNone,
    ],
  );
}

export function mysqlConfigured(): boolean {
  return loadConfig() !== null;
}

export async function pingGalleryMysql(): Promise<{ ok: boolean; database?: string; error?: string }> {
  const cfg = loadConfig();
  if (!cfg) return { ok: false, error: "Not configured" };
  const db = await getPool();
  if (!db) return { ok: false, error: "Not configured" };
  try {
    await ensureTable(db);
    const [rows] = await db.query<mysql.RowDataPacket[]>("select database() as db");
    const name = rows[0]?.db;
    return { ok: true, database: typeof name === "string" ? name : cfg.database };
  } catch {
    return { ok: false, error: "Could not reach SiteGround MySQL" };
  }
}
