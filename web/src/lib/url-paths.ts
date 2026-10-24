import { ARTICLES } from "@/data/articles";
import { CITIES, SERVICES } from "@/data/site";

export const HIDDEN_PREFIXES = ["/admin", "/login", "/api", "/internal", "/auth", "/checklist"];

export function normalizePath(input: string): string {
  let raw = input.trim();
  try {
    if (/^https?:\/\//i.test(raw)) raw = new URL(raw).pathname;
  } catch {
    /* keep raw */
  }
  raw = raw.split("?")[0].split("#")[0];
  if (!raw.startsWith("/")) raw = `/${raw}`;
  raw = raw.replace(/\/{2,}/g, "/");
  if (raw !== "/" && !/\.[a-z0-9]{1,8}$/i.test(raw) && !raw.endsWith("/")) raw += "/";
  return raw.toLowerCase();
}

export function isHiddenPath(path: string) {
  return HIDDEN_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Paths this rebuild already serves as real pages. */
export function listLivePaths(): string[] {
  const set = new Set<string>(["/", "/blog/", "/portfolio/", "/get-started/", "/contact/", "/about/"]);
  for (const s of SERVICES) set.add(normalizePath(s.href));
  for (const c of CITIES) set.add(normalizePath(c.href));
  for (const a of ARTICLES) set.add(normalizePath(a.href));
  for (const extra of [
    "/employment/",
    "/service-area/",
    "/category/services/",
    "/before-and-after/",
    "/covered-porches-by-pfeifer/",
    "/sunroom/",
    "/outdoor-kitchen/",
    "/full-home-remodels/",
    "/fayetteville-ga/",
    "/senoia-ga/",
  ]) {
    set.add(normalizePath(extra));
  }
  return [...set].filter((p) => !isHiddenPath(p)).sort();
}

export const SEEDED_REDIRECTS: { from: string; to: string }[] = [
  { from: "/home/", to: "/" },
  { from: "/company/", to: "/about/" },
  { from: "/get-in-touch/", to: "/contact/" },
  { from: "/start-here/", to: "/get-started/" },
  { from: "/services/", to: "/category/services/" },
  { from: "/decks/", to: "/decks-by-pfeifer/" },
  { from: "/deck/", to: "/decks-by-pfeifer/" },
  { from: "/kitchen/", to: "/kitchens/" },
  { from: "/kitchen-remodels/", to: "/kitchens/" },
  { from: "/bathrooms/", to: "/bathroom-remodels/" },
  { from: "/bathroom/", to: "/bathroom-remodels/" },
  { from: "/garages/", to: "/detached-garages/" },
  { from: "/garage/", to: "/detached-garages/" },
  { from: "/additions/", to: "/home-addition-contractor/" },
  { from: "/home-additions/", to: "/home-addition-contractor/" },
  { from: "/basements/", to: "/basement-remodels/" },
  { from: "/basement/", to: "/basement-remodels/" },
  { from: "/commercial/", to: "/commercial-buildings/" },
  { from: "/full-home-remodel/", to: "/full-home-remodels/" },
  { from: "/peachtree-city/", to: "/peachtree-city-ga/" },
  { from: "/tyrone/", to: "/tyrone-ga/" },
  { from: "/brooks/", to: "/brooks-ga/" },
  { from: "/newnan/", to: "/newnan-ga/" },
  { from: "/gallery/", to: "/portfolio/" },
  { from: "/our-work/", to: "/portfolio/" },
  { from: "/feed/", to: "/blog/" },
  { from: "/comments/feed/", to: "/blog/" },
  { from: "/porches/", to: "/covered-porches-by-pfeifer/" },
  { from: "/covered-porches/", to: "/covered-porches-by-pfeifer/" },
  { from: "/screen-porch/", to: "/covered-porches-by-pfeifer/" },
  { from: "/poolhouses/", to: "/pool-houses-by-pfeifer/" },
  { from: "/pool-house/", to: "/pool-houses-by-pfeifer/" },
  { from: "/pool-houses/", to: "/pool-houses-by-pfeifer/" },
  { from: "/sunrooms/", to: "/sunroom/" },
  { from: "/outdoor-kitchens/", to: "/outdoor-kitchen/" },
  { from: "/fayetteville/", to: "/fayetteville-ga/" },
  { from: "/senoia/", to: "/senoia-ga/" },
  { from: "/author/", to: "/about/" },
  { from: "/tag/", to: "/blog/" },
  { from: "/category/blogposts/", to: "/blog/" },
];

/** Extra WordPress leftovers to check even when the live sitemap is blocked. */
export const WORDPRESS_CANDIDATES = [
  "/about-us/",
  "/contact-us/",
  "/our-team/",
  "/team/",
  "/testimonials/",
  "/reviews/",
  "/privacy-policy/",
  "/privacy/",
  "/terms/",
  "/sitemap/",
  "/site-map/",
  "/home/",
  "/company/",
  "/get-in-touch/",
  "/start-here/",
  "/services/",
  "/decks/",
  "/kitchen-remodels/",
  "/bathrooms/",
  "/garages/",
  "/additions/",
  "/basements/",
  "/commercial/",
  "/gallery/",
  "/our-work/",
  "/feed/",
  "/porches/",
  "/sunrooms/",
  "/outdoor-kitchens/",
  "/peachtree-city/",
  "/tyrone/",
  "/fayetteville/",
  "/brooks/",
  "/newnan/",
  "/senoia/",
  "/wp-admin/",
  "/wp-login.php",
];

export function suggestDestination(fromPath: string, live: string[]): string | null {
  const from = normalizePath(fromPath);
  if (live.includes(from)) return null;
  const slug = from.replace(/^\/|\/$/g, "").replace(/\.php$/i, "");
  const tokens = slug.split("/").join("-");

  const exact = live.find((p) => p.replace(/^\/|\/$/g, "") === slug);
  if (exact) return exact;

  const rules: [RegExp, string][] = [
    [/deck/, "/decks-by-pfeifer/"],
    [/porch|pergola|sunroom/, "/covered-porches-by-pfeifer/"],
    [/kitchen|cabinet/, "/kitchens/"],
    [/bath/, "/bathroom-remodels/"],
    [/garage|rv-build/, "/detached-garages/"],
    [/basement/, "/basement-remodels/"],
    [/addition|second-story|adu|in-law/, "/home-addition-contractor/"],
    [/commercial|tenant|buildout/, "/commercial-buildings/"],
    [/full-home|whole-house|remodel/, "/full-home-remodels/"],
    [/peachtree/, "/peachtree-city-ga/"],
    [/tyrone/, "/tyrone-ga/"],
    [/fayetteville/, "/fayetteville-ga/"],
    [/brooks/, "/brooks-ga/"],
    [/newnan/, "/newnan-ga/"],
    [/senoia/, "/senoia-ga/"],
    [/gallery|portfolio|our-work|before/, "/portfolio/"],
    [/blog|feed|article|news/, "/blog/"],
    [/contact|get-in-touch/, "/contact/"],
    [/about|company|team|author/, "/about/"],
    [/get-started|start-here|bid|quote/, "/get-started/"],
  ];
  for (const [re, dest] of rules) {
    if (re.test(tokens) && live.includes(dest)) return dest;
  }
  return null;
}

export function parseSitemapLocs(xml: string): string[] {
  const locs = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) => m[1].trim());
  return locs.map(normalizePath);
}
