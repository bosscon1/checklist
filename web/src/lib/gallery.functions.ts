import { spawn } from "node:child_process";
import { mkdir, readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { assertStaffUser } from "@/lib/assert-staff";
import { withBase } from "@/lib/preview-base";
import {
  GALLERY_SLUGS,
  galleryStem,
  isGalleryCategory,
  slugPart,
  type GalleryCategory,
} from "@/lib/gallery";
import { readGallerySettings, writeGallerySettings, pingGalleryMysql } from "@/lib/gallery-mysql";

const IMAGES = join(process.cwd(), "public/images");
const GALLERIES = join(IMAGES, "galleries");
const VIDEOS = join(process.cwd(), "public/videos");
const SCRIPT = join(process.cwd(), "scripts/process-gallery-photo.py");
const DEFAULT_OVERLAY = 55;
const MAX_VIDEO_BYTES = 18 * 1024 * 1024;

export type GalleryFile = {
  name: string;
  url: string;
  bytes: number;
  kind: "large" | "thumb" | "other";
};

export type GalleryFolder = {
  category: GalleryCategory;
  count: number;
  files: GalleryFile[];
  featured: string | null;
  order: string[];
  overlay: number;
  videoName: string | null;
  videoUrl: string | null;
  publicPath: string;
};

export type GalleryAlbum = {
  category: string;
  featured: string | null;
  featuredUrl: string | null;
  overlay: number;
  videoUrl: string | null;
  photos: { src: string; fullSrc: string; alt: string; name: string }[];
};

type Manifest = { featured?: string; order?: string[]; overlay?: number; video?: string | null };

async function dirHasPhotos(dir: string): Promise<boolean> {
  try {
    const names = await readdir(dir);
    return names.some((n) => n.endsWith(".jpg") && !n.endsWith("-thumb.jpg") && !n.startsWith("."));
  } catch {
    return false;
  }
}

async function resolveStore(category: string): Promise<{ dir: string; urlBase: string }> {
  const direct = { dir: join(IMAGES, category), urlBase: `/images/${category}` };
  const nested = { dir: join(GALLERIES, category), urlBase: `/images/galleries/${category}` };
  if (await dirHasPhotos(direct.dir)) return direct;
  if (await dirHasPhotos(nested.dir)) return nested;
  return nested;
}

async function ensureFolders() {
  for (const cat of GALLERY_SLUGS) {
    await mkdir(join(GALLERIES, cat), { recursive: true });
  }
}

function kindOf(name: string): GalleryFile["kind"] {
  if (name.endsWith("-thumb.jpg")) return "thumb";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "large";
  return "other";
}

async function readFileManifest(dir: string): Promise<Manifest> {
  try {
    const raw = JSON.parse(await readFile(join(dir, "gallery.json"), "utf8")) as Manifest;
    const overlay = clampOverlay(raw.overlay);
    const video =
      raw.video === null || raw.video === ""
        ? null
        : typeof raw.video === "string"
          ? raw.video
          : undefined;
    return {
      featured: typeof raw.featured === "string" ? raw.featured : undefined,
      order: Array.isArray(raw.order) ? raw.order.filter((n) => typeof n === "string") : undefined,
      overlay,
      video,
    };
  } catch {
    return { overlay: DEFAULT_OVERLAY };
  }
}

async function readManifest(category: string, dir: string): Promise<Manifest> {
  const file = await readFileManifest(dir);
  const remote = await readGallerySettings(category);
  if (!remote) return file;
  return {
    featured: remote.featured ?? file.featured,
    order: remote.order ?? file.order,
    overlay: remote.overlay ?? file.overlay,
    video: remote.video !== undefined ? remote.video : file.video,
  };
}

function clampOverlay(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return DEFAULT_OVERLAY;
  return Math.max(0, Math.min(80, Math.round(n)));
}

async function writeManifest(category: string, dir: string, patch: Manifest) {
  const prev = await readManifest(category, dir);
  const next: Manifest = {
    featured: patch.featured !== undefined ? patch.featured : prev.featured,
    order: patch.order !== undefined ? patch.order : prev.order,
    overlay: patch.overlay !== undefined ? clampOverlay(patch.overlay) : prev.overlay,
    video: patch.video !== undefined ? patch.video : prev.video,
  };
  const out: Record<string, unknown> = {};
  if (next.featured) out.featured = next.featured;
  if (next.order) out.order = next.order;
  if (typeof next.overlay === "number") out.overlay = next.overlay;
  if (next.video === null) out.video = null;
  else if (next.video) out.video = next.video;
  await writeGallerySettings(category, next);
  await writeFile(join(dir, "gallery.json"), `${JSON.stringify(out, null, 2)}\n`);
}

async function videoExists(name: string): Promise<boolean> {
  try {
    const info = await stat(join(VIDEOS, name));
    return info.isFile();
  } catch {
    return false;
  }
}

async function resolveVideo(
  category: string,
  declared?: string | null,
): Promise<{ name: string; url: string } | null> {
  if (declared === null) return null;
  const names = [declared, `hero-${category}.mp4`, category === "porches" ? "hero-porch.mp4" : undefined];
  const seen = new Set<string>();
  for (const name of names) {
    if (!name || seen.has(name)) continue;
    seen.add(name);
    if (name.includes("/") || name.includes("\\") || name.startsWith(".")) continue;
    if (!name.endsWith(".mp4")) continue;
    if (await videoExists(name)) return { name, url: withBase(`/videos/${name}`) };
  }
  return null;
}

function sortLarges(names: string[], order?: string[]): string[] {
  const larges = names.filter((n) => kindOf(n) === "large").sort();
  if (!order?.length) return larges;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const name of order) {
    if (larges.includes(name) && !seen.has(name)) {
      out.push(name);
      seen.add(name);
    }
  }
  for (const name of larges) {
    if (!seen.has(name)) out.push(name);
  }
  return out;
}

async function readFolder(category: GalleryCategory): Promise<GalleryFolder> {
  const store = await resolveStore(category);
  await mkdir(store.dir, { recursive: true });
  const names = (await readdir(store.dir)).filter((n) => !n.startsWith(".") && n !== "gallery.json");
  const manifest = await readManifest(category, store.dir);
  const ordered = sortLarges(names, manifest.order);
  const files: GalleryFile[] = [];
  for (const name of [...ordered, ...names.filter((n) => kindOf(n) !== "large").sort()]) {
    if (files.some((f) => f.name === name)) continue;
    const info = await stat(join(store.dir, name));
    if (!info.isFile()) continue;
    files.push({
      name,
      url: withBase(`${store.urlBase}/${name}`),
      bytes: info.size,
      kind: kindOf(name),
    });
  }
  const featured = manifest.featured && ordered.includes(manifest.featured) ? manifest.featured : ordered[0] ?? null;
  const video = await resolveVideo(category, manifest.video);
  return {
    category,
    count: ordered.length,
    files,
    featured,
    order: ordered,
    overlay: clampOverlay(manifest.overlay),
    videoName: video?.name ?? null,
    videoUrl: video?.url ?? null,
    publicPath: store.urlBase,
  };
}

function nextNumber(existing: string[], city: string, what: string): number {
  const prefix = galleryStem(city, what, 1).replace(/-01$/, "-");
  let max = 0;
  for (const name of existing) {
    if (!name.startsWith(prefix) || name.includes("-thumb.")) continue;
    const m = name.match(/-(\d+)\.jpe?g$/i);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

function decodeImage(raw: string): Buffer {
  const trimmed = raw.trim();
  const comma = trimmed.indexOf(",");
  const payload = trimmed.startsWith("data:") && comma >= 0 ? trimmed.slice(comma + 1) : trimmed;
  return Buffer.from(payload, "base64");
}

function runProcessor(src: string, large: string, thumb: string): Promise<{
  ok: boolean;
  error?: string;
  large?: { bytes: number; width: number; height: number };
  thumb?: { bytes: number; width: number; height: number };
}> {
  return new Promise((resolve) => {
    const child = spawn("python3", [SCRIPT, src, large, thumb], { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.on("data", (c) => {
      out += String(c);
    });
    child.stderr.on("data", (c) => {
      err += String(c);
    });
    child.on("close", () => {
      try {
        resolve(JSON.parse(out));
      } catch {
        resolve({ ok: false, error: err || out || "Processor failed." });
      }
    });
  });
}

function toAlbum(folder: GalleryFolder): GalleryAlbum {
  const larges = folder.order;
  const photos = larges.map((name) => {
    const thumb = name.replace(/\.jpe?g$/i, "-thumb.jpg");
    const thumbFile = folder.files.find((f) => f.name === thumb);
    const largeFile = folder.files.find((f) => f.name === name);
    return {
      name,
      src: thumbFile?.url ?? largeFile?.url ?? "",
      fullSrc: largeFile?.url ?? "",
      alt: name.replace(/\.jpe?g$/i, "").replace(/-/g, " "),
    };
  });
  const featured = folder.featured;
  const featuredFile = folder.files.find((f) => f.name === featured);
  return {
    category: folder.category,
    featured,
    featuredUrl: featuredFile?.url ?? photos[0]?.fullSrc ?? null,
    overlay: folder.overlay,
    videoUrl: folder.videoUrl,
    photos,
  };
}

export const listGalleryFolders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertStaffUser(context.userId);
    await ensureFolders();
    const folders: GalleryFolder[] = [];
    for (const category of GALLERY_SLUGS) {
      folders.push(await readFolder(category));
    }
    return folders;
  });

export const galleryMysqlStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertStaffUser(context.userId);
    return pingGalleryMysql();
  });

export const loadGalleryAlbum = createServerFn({ method: "GET" })
  .validator(z.object({ category: z.string() }))
  .handler(async ({ data }) => {
    if (!isGalleryCategory(data.category)) throw new Error("Unknown gallery.");
    return toAlbum(await readFolder(data.category));
  });

export const saveGalleryAlbum = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      category: z.string(),
      featured: z.string().min(1),
      order: z.array(z.string()).min(1),
    }),
  )
  .handler(async ({ data, context }) => {
    await assertStaffUser(context.userId);
    if (!isGalleryCategory(data.category)) throw new Error("Pick a gallery folder.");
    const store = await resolveStore(data.category);
    const folder = await readFolder(data.category);
    const allowed = new Set(folder.files.filter((f) => f.kind === "large").map((f) => f.name));
    const order = data.order.filter((name) => allowed.has(name));
    const featured = allowed.has(data.featured) ? data.featured : order[0];
    if (!featured) throw new Error("No photos in that folder yet.");
    await writeManifest(data.category, store.dir, { featured, order });
    return toAlbum(await readFolder(data.category));
  });

export const deleteGalleryPhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      category: z.string(),
      name: z.string().min(1).max(180),
    }),
  )
  .handler(async ({ data, context }) => {
    await assertStaffUser(context.userId);
    if (!isGalleryCategory(data.category)) throw new Error("Pick a gallery folder.");
    if (data.name.includes("/") || data.name.includes("\\") || data.name.startsWith(".")) {
      throw new Error("Invalid file name.");
    }
    if (!data.name.endsWith(".jpg") && !data.name.endsWith(".jpeg")) {
      throw new Error("Only gallery JPEGs can be deleted here.");
    }
    const store = await resolveStore(data.category);
    const folder = await readFolder(data.category);
    const allowed = new Set(folder.files.map((f) => f.name));
    const largeName = data.name.endsWith("-thumb.jpg")
      ? data.name.replace(/-thumb\.jpg$/i, ".jpg")
      : data.name;
    if (!allowed.has(largeName) && !allowed.has(data.name)) {
      throw new Error("That photo is not in this folder.");
    }
    const thumbName = largeName.replace(/\.jpe?g$/i, "-thumb.jpg");
    for (const name of [largeName, thumbName]) {
      try {
        await unlink(join(store.dir, name));
      } catch {
        // already gone
      }
    }
    const order = folder.order.filter((n) => n !== largeName);
    const featured = folder.featured === largeName ? order[0] ?? null : folder.featured;
    await writeManifest(data.category, store.dir, { featured: featured ?? undefined, order });
    return { folder: await readFolder(data.category), deleted: largeName };
  });

export const uploadGalleryPhotos = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      category: z.string(),
      city: z.string().max(40).optional().default(""),
      what: z.string().min(2).max(48),
      files: z
        .array(
          z.object({
            name: z.string().min(1).max(180),
            data: z.string().min(32),
          }),
        )
        .min(1)
        .max(12),
    }),
  )
  .handler(async ({ data, context }) => {
    await assertStaffUser(context.userId);
    if (!isGalleryCategory(data.category)) throw new Error("Pick a gallery folder.");
    const what = slugPart(data.what);
    if (!what) throw new Error("Describe what the photos show.");
    const city = slugPart(data.city ?? "");
    await ensureFolders();
    const store = await resolveStore(data.category);
    const folder = await readFolder(data.category);
    let n = nextNumber(folder.files.map((f) => f.name), city, what);
    const results: {
      original: string;
      stem: string;
      largeUrl: string;
      thumbUrl: string;
      largeKb: number;
      thumbKb: number;
      error?: string;
    }[] = [];

    for (const file of data.files) {
      const stem = galleryStem(city, what, n);
      n += 1;
      const tmp = join(tmpdir(), `pfeifer-${Date.now()}-${n}-${file.name.replace(/[^\w.-]+/g, "")}`);
      const largePath = join(store.dir, `${stem}.jpg`);
      const thumbPath = join(store.dir, `${stem}-thumb.jpg`);
      try {
        await writeFile(tmp, decodeImage(file.data));
        const processed = await runProcessor(tmp, largePath, thumbPath);
        if (!processed.ok) {
          results.push({
            original: file.name,
            stem,
            largeUrl: "",
            thumbUrl: "",
            largeKb: 0,
            thumbKb: 0,
            error: processed.error || "Could not process that photo.",
          });
          continue;
        }
        results.push({
          original: file.name,
          stem,
          largeUrl: withBase(`${store.urlBase}/${stem}.jpg`),
          thumbUrl: withBase(`${store.urlBase}/${stem}-thumb.jpg`),
          largeKb: Math.round((processed.large?.bytes ?? 0) / 1024),
          thumbKb: Math.round((processed.thumb?.bytes ?? 0) / 1024),
        });
      } catch (err) {
        results.push({
          original: file.name,
          stem,
          largeUrl: "",
          thumbUrl: "",
          largeKb: 0,
          thumbKb: 0,
          error: err instanceof Error ? err.message : "Upload failed.",
        });
      }
    }

    return {
      category: data.category,
      folders: await Promise.all(GALLERY_SLUGS.map((c) => readFolder(c))),
      results,
    };
  });

export const saveGalleryHero = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      category: z.string(),
      overlay: z.number().min(0).max(80),
    }),
  )
  .handler(async ({ data, context }) => {
    await assertStaffUser(context.userId);
    if (!isGalleryCategory(data.category)) throw new Error("Pick a gallery folder.");
    const store = await resolveStore(data.category);
    await mkdir(store.dir, { recursive: true });
    await writeManifest(data.category, store.dir, { overlay: clampOverlay(data.overlay) });
    return readFolder(data.category);
  });

export const uploadGalleryVideo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      category: z.string(),
      name: z.string().min(1).max(180),
      data: z.string().min(32),
    }),
  )
  .handler(async ({ data, context }) => {
    await assertStaffUser(context.userId);
    if (!isGalleryCategory(data.category)) throw new Error("Pick a gallery folder.");
    const buf = decodeImage(data.data);
    if (buf.byteLength > MAX_VIDEO_BYTES) {
      throw new Error("Keep the hero video under 18 MB.");
    }
    if (buf.byteLength < 32) throw new Error("That file is empty.");
    await mkdir(VIDEOS, { recursive: true });
    const name = `hero-${data.category}.mp4`;
    await writeFile(join(VIDEOS, name), buf);
    const store = await resolveStore(data.category);
    await mkdir(store.dir, { recursive: true });
    await writeManifest(data.category, store.dir, { video: name });
    return readFolder(data.category);
  });

export const deleteGalleryVideo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ category: z.string() }))
  .handler(async ({ data, context }) => {
    await assertStaffUser(context.userId);
    if (!isGalleryCategory(data.category)) throw new Error("Pick a gallery folder.");
    const name = `hero-${data.category}.mp4`;
    try {
      await unlink(join(VIDEOS, name));
    } catch {
      /* not uploaded, or already gone */
    }
    const store = await resolveStore(data.category);
    await mkdir(store.dir, { recursive: true });
    await writeManifest(data.category, store.dir, { video: null });
    return readFolder(data.category);
  });
