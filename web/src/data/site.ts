export const SITE = {
  name: "Pfeifer Building Company",
  legal: "Pfeifer Building Company LLC",
  tagline: "Excellence in Construction since 1997",
  founded: 1997,
  phone: "770-487-1380",
  phoneHref: "tel:7704871380",
  email: "office@pfeiferbuild.com",
  emailHref: "mailto:office@pfeiferbuild.com",
  addressLine: "1415 Senoia Road, Suite B",
  cityLine: "Tyrone, GA 30290",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=1415+Senoia+Road+Suite+B+Tyrone+GA+30290",
  hours: "Office 9am–5pm weekdays. Project managers by phone or text as needed.",
  canonicalOrigin: "https://pfeiferbuild.com",
  serviceArea:
    "Fayette and Coweta Counties — Peachtree City, Tyrone, Fayetteville, Brooks, Newnan, and Senoia",
};

export const SERVICES = [
  {
    href: "/decks-by-pfeifer/",
    title: "Decks",
    image: "/images/hero-deck.jpg",
    blurb: "Rebuilds, Trex and composite, KDAT, covered decks, and railings.",
  },
  {
    href: "/kitchens/",
    title: "Kitchens",
    image: "/images/kitchen.jpg",
    blurb: "Cabinets, quartz, tile, and full kitchen remodels from idea to punch list.",
  },
  {
    href: "/bathroom-remodels/",
    title: "Bathrooms",
    image: "/images/bathroom.jpg",
    blurb: "Walk-in showers, tile, vanities, and licensed plumbing coordination.",
  },
  {
    href: "/detached-garages/",
    title: "Garages",
    image: "/images/garage.jpg",
    blurb: "Detached and attached garages, RV buildings, and bonus rooms above.",
  },
  {
    href: "/home-addition-contractor/",
    title: "Additions",
    image: "/images/addition.jpg",
    blurb: "Room additions, second stories, porches, sunrooms, and ADUs.",
  },
  {
    href: "/basement-remodels/",
    title: "Basements",
    image: "/images/basement.jpg",
    blurb: "Finish unused space into family rooms, bars, offices, and suites.",
  },
  {
    href: "/commercial-buildings/",
    title: "Commercial",
    image: "/images/commercial.jpg",
    blurb: "Tenant buildouts and commercial GC work with county and fire review.",
  },
  {
    href: "/full-home-remodels/",
    title: "Full-home remodels",
    image: "/images/full-home.jpg",
    blurb: "Whole-house updates that keep the home you already own.",
  },
  {
    href: "/covered-porches-by-pfeifer/",
    title: "Covered porches",
    image: "/images/porch.jpg",
    blurb: "Covered and screened porches, fireplaces, and outdoor living that matches the house.",
  },
  {
    href: "/pool-houses-by-pfeifer/",
    title: "Pool houses",
    image: "/images/poolhouses/pfeifer-peachtree-city-pool-house-01.jpg",
    blurb: "Cabanas, pool baths, outdoor kitchens, and pool houses that match the house.",
  },
] as const;

export const CITIES = [
  { href: "/peachtree-city-ga/", name: "Peachtree City" },
  { href: "/tyrone-ga/", name: "Tyrone" },
  { href: "/fayetteville-ga/", name: "Fayetteville" },
  { href: "/brooks-ga/", name: "Brooks" },
  { href: "/newnan-ga/", name: "Newnan" },
  { href: "/senoia-ga/", name: "Senoia" },
] as const;

export const TEAM = [
  {
    name: "Duey Pfeifer",
    role: "Founder / Design & Estimating Consultant",
    initials: "DP",
    bio: "Maryland native who moved to Peachtree City in 1987 to work for Ravin Homes, building hundreds of new houses across Fayette and Coweta. When the area built out, he started Pfeifer Building Company in 1997 to improve the homes already here.",
  },
  {
    name: "Brooks Pfeifer",
    role: "Senior Project Manager",
    initials: "BP",
    bio: "Clemson class of 2013, Psychology, honors. Grew up working summers for the family company and joined full-time in 2014. He manages crews he worked beside as a kid. Part owner.",
  },
  {
    name: "Brian Selleck",
    role: "General Manager",
    initials: "BS",
    bio: "Entire career in construction — pouring concrete, building homes, and commercial buildings. Helps keep jobs moving from the office through the jobsite.",
  },
  {
    name: "Tricia Heard",
    role: "Office Manager",
    initials: "TH",
    bio: "Runs the office — calls, email, insurance certificates, payroll, and the rest of the work that keeps a GC shop honest. Often accompanied by her Heeler, Darla.",
  },
] as const;

export const REASONS = [
  {
    n: "01",
    title: "Licensed and insured",
    body: "Licensed Georgia general contractors. We pull permits. We carry $3 million in liability insurance and will send a certificate on request.",
  },
  {
    n: "02",
    title: "30 years of experience",
    body: "Most contractors have not seen the mistakes we already paid to learn. We know how to do the work you actually want done.",
  },
  {
    n: "03",
    title: "Five-star reviews",
    body: "Everybody has reviews. Odds are we have more. They are a fair picture of how we treat customers after the contract is signed.",
  },
  {
    n: "04",
    title: "Permits and drawings",
    body: "We handle your design, CAD drawings, and permits, so you can focus on the things that matter to you.",
  },
  {
    n: "05",
    title: "Local and trusted",
    body: "Based in Tyrone. We stay in Fayette and Coweta — close to our suppliers and the people we build for.",
  },
  {
    n: "06",
    title: "Exceptional quality",
    body: "Master carpenters and tradesmen on the install. Industry knowledge, not a crew that showed up from a listing site.",
  },
] as const;

export const PROJECT_TYPES = [
  "Deck",
  "Kitchen",
  "Bath",
  "Garage",
  "Addition",
  "Basement",
  "Commercial",
  "Other",
] as const;

export function canonical(path: string) {
  const p = path.endsWith("/") || path === "/" ? path : `${path}/`;
  return `${SITE.canonicalOrigin}${p === "//" ? "/" : p}`;
}

export const jsonLd = {
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
    "Fayetteville, GA",
    "Brooks, GA",
    "Newnan, GA",
    "Senoia, GA",
  ],
  priceRange: "Cost-plus",
};
