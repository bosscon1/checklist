import { ARTICLES, type Article } from "@/data/articles";
import { TAGS, TAG_LABEL, type Tag } from "@/data/tags";

export type { Tag };
export { TAGS, TAG_LABEL };
const MONTH_NAME = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const POSTS_PER_PAGE = 10;

export function parseDisplayDate(date: string): string {
  const m = date.trim().match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (!m) return "1970-01-01";
  const month = MONTH_NAME.findIndex((n) => n.toLowerCase() === m[1].toLowerCase());
  if (month < 0) return "1970-01-01";
  return `${m[3]}-${String(month + 1).padStart(2, "0")}-${String(Number(m[2])).padStart(2, "0")}`;
}

export function articleIso(a: Article): string {
  return a.publishedAt ?? parseDisplayDate(a.date);
}

export function articleTags(a: Article): Tag[] {
  return (a.tags ?? []) as Tag[];
}

export function inBlog(a: Article): boolean {
  return a.inBlog !== false;
}

export function blogArticles(): Article[] {
  return ARTICLES.filter(inBlog).sort((a, b) => (articleIso(a) < articleIso(b) ? 1 : -1));
}

export function articlesByMonth(year: string, month: string): Article[] {
  const mm = month.padStart(2, "0");
  const prefix = `${year}-${mm}-`;
  return blogArticles().filter((a) => articleIso(a).startsWith(prefix));
}

export function articlesByYear(year: string): Article[] {
  return blogArticles().filter((a) => articleIso(a).startsWith(`${year}-`));
}

export function articlesByTag(tag: string): Article[] {
  return blogArticles().filter((a) => articleTags(a).includes(tag as Tag));
}

export function monthLabel(year: string, month: string): string {
  const i = Number(month) - 1;
  return `${MONTH_NAME[i] ?? month} ${year}`;
}

export function monthPath(iso: string): string {
  const [y, m] = iso.split("-");
  return `/${y}/${m}/`;
}

export function uniqueMonths(): { year: string; month: string; label: string; count: number; href: string }[] {
  const map = new Map<string, number>();
  for (const a of blogArticles()) {
    const iso = articleIso(a);
    const key = iso.slice(0, 7);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, count]) => {
      const [year, month] = key.split("-");
      return { year, month, label: monthLabel(year, month), count, href: `/${year}/${month}/` };
    });
}

export function uniqueYears(): { year: string; count: number; href: string }[] {
  const map = new Map<string, number>();
  for (const a of blogArticles()) {
    const y = articleIso(a).slice(0, 4);
    map.set(y, (map.get(y) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([year, count]) => ({ year, count, href: `/${year}/` }));
}

export function usedTags(): { tag: Tag; label: string; count: number; href: string }[] {
  const map = new Map<Tag, number>();
  for (const a of blogArticles()) {
    for (const t of articleTags(a)) {
      map.set(t, (map.get(t) ?? 0) + 1);
    }
  }
  return TAGS.filter((t) => map.has(t)).map((tag) => ({
    tag,
    label: TAG_LABEL[tag],
    count: map.get(tag) ?? 0,
    href: `/blog/topic/${tag}/`,
  }));
}

export function isTag(value: string): value is Tag {
  return (TAGS as readonly string[]).includes(value);
}

export function pageCount(total = blogArticles().length): number {
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
}

export function pageSlice(page: number, list = blogArticles()): Article[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  return list.slice(start, start + POSTS_PER_PAGE);
}
