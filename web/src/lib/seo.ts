import { canonical, SITE } from "@/data/site";

export function pageHead(opts: {
  title: string;
  description: string;
  path: string;
}) {
  const url = canonical(opts.path);
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: opts.title },
      { name: "description", content: opts.description },
      { name: "theme-color", content: "#3A4048" },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: opts.title },
      { name: "twitter:description", content: opts.description },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap" },
    ],
  };
}

export function orgJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: SITE.name,
    legalName: SITE.legal,
    url: SITE.canonicalOrigin,
    telephone: "+1-770-487-1380",
    email: SITE.email,
    foundingDate: "1997",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1415 Senoia Road, Suite B",
      addressLocality: "Tyrone",
      addressRegion: "GA",
      postalCode: "30290",
      addressCountry: "US",
    },
    areaServed: [
      "Fayette County, GA",
      "Coweta County, GA",
      "Peachtree City, GA",
      "Tyrone, GA",
      "Newnan, GA",
    ],
  });
}
