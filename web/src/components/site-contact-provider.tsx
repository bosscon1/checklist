import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getPublicSiteContact } from "@/lib/site-contact.functions";
import { defaultSiteContact, type SiteContact } from "@/lib/site-contact";

const SiteContactContext = createContext<{
  contact: SiteContact;
  setContact: (next: SiteContact) => void;
}>({
  contact: defaultSiteContact(),
  setContact: () => {},
});

export function SiteContactProvider({ children }: { children: ReactNode }) {
  const [contact, setContact] = useState<SiteContact>(defaultSiteContact);
  useEffect(() => {
    let live = true;
    void getPublicSiteContact()
      .then((next) => {
        if (live) setContact(next);
      })
      .catch(() => {
        /* keep printed defaults */
      });
    return () => {
      live = false;
    };
  }, []);
  const value = useMemo(() => ({ contact, setContact }), [contact]);
  return <SiteContactContext.Provider value={value}>{children}</SiteContactContext.Provider>;
}

export function useSiteContact() {
  return useContext(SiteContactContext).contact;
}

export function useSetSiteContact() {
  return useContext(SiteContactContext).setContact;
}
