/** Folders shown on https://pfeiferbuild.com/portfolio/ (Drive albums + service galleries). */
export const GALLERY_CATEGORIES = [
  { id: "decks", label: "Decks" },
  { id: "kitchens", label: "Kitchen Remodels" },
  { id: "bathrooms", label: "Bathroom Remodels" },
  { id: "garages", label: "Detached Garages" },
  { id: "additions", label: "Home Additions" },
  { id: "basements", label: "Basement Remodels" },
  { id: "commercial", label: "Commercial" },
  { id: "porches", label: "Covered Porches" },
  { id: "poolhouses", label: "Pool Houses" },
  { id: "outdoor-spaces", label: "Outdoor Spaces" },
  { id: "fireplaces", label: "Fireplaces" },
  { id: "hd-renderings", label: "HD Renderings" },
] as const;

export const GALLERY_SLUGS = GALLERY_CATEGORIES.map((c) => c.id);

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]["id"];

export function isGalleryCategory(value: string): value is GalleryCategory {
  return (GALLERY_SLUGS as readonly string[]).includes(value);
}

export function galleryLabel(id: string): string {
  return GALLERY_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function slugPart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function galleryStem(city: string, what: string, n: number): string {
  const pad = String(n).padStart(2, "0");
  const cityPart = slugPart(city);
  const whatPart = slugPart(what) || "photo";
  if (cityPart) return `pfeifer-${cityPart}-${whatPart}-${pad}`;
  return `pfeifer-${whatPart}-${pad}`;
}
