import { SITE } from "@/data/site";

export type SiteContact = {
  phone: string;
  email: string;
  addressLine: string;
  cityLine: string;
  hours: string;
  serviceArea: string;
  phoneHref: string;
  emailHref: string;
  mapsHref: string;
  updatedAt: string | null;
  updatedBy: string | null;
};

export function phoneHrefFrom(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

export function emailHrefFrom(email: string) {
  return `mailto:${email.trim()}`;
}

export function mapsHrefFrom(addressLine: string, cityLine: string) {
  const q = encodeURIComponent(`${addressLine} ${cityLine}`.trim());
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function defaultSiteContact(): SiteContact {
  return {
    phone: SITE.phone,
    email: SITE.email,
    addressLine: SITE.addressLine,
    cityLine: SITE.cityLine,
    hours: SITE.hours,
    serviceArea: SITE.serviceArea,
    phoneHref: SITE.phoneHref,
    emailHref: SITE.emailHref,
    mapsHref: SITE.mapsHref,
    updatedAt: null,
    updatedBy: null,
  };
}

export function withDerivedContact(
  row: Omit<SiteContact, "phoneHref" | "emailHref" | "mapsHref">,
): SiteContact {
  return {
    ...row,
    phoneHref: phoneHrefFrom(row.phone),
    emailHref: emailHrefFrom(row.email),
    mapsHref: mapsHrefFrom(row.addressLine, row.cityLine),
  };
}
