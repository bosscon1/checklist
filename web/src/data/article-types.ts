import type { Tag } from "@/data/tags";

export type Article = {
  href: string;
  title: string;
  titleTag: string;
  date: string;
  excerpt: string;
  description: string;
  image: string;
  imageAlt: string;
  h1: string;
  lede: string;
  sections: { heading: string; paragraphs: string[] }[];
  related: { href: string; label: string }[];
  publishedAt?: string;
  tags?: Tag[];
  inBlog?: boolean;
};
