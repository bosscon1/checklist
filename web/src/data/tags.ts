export const TAGS = [
  "decks",
  "porches",
  "kitchens",
  "baths",
  "garages",
  "additions",
  "basements",
  "commercial",
  "outdoor-living",
  "peachtree-city",
  "coweta",
  "materials",
  "how-to",
] as const;

export type Tag = (typeof TAGS)[number];

export const TAG_LABEL: Record<Tag, string> = {
  decks: "Decks",
  porches: "Porches",
  kitchens: "Kitchens",
  baths: "Baths",
  garages: "Garages",
  additions: "Additions",
  basements: "Basements",
  commercial: "Commercial",
  "outdoor-living": "Outdoor living",
  "peachtree-city": "Peachtree City",
  coweta: "Coweta",
  materials: "Materials",
  "how-to": "How-to",
};
