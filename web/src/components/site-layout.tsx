import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { SiteContactProvider } from "@/components/site-contact-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bare =
    pathname.startsWith("/internal") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/checklist");

  if (bare) {
    return <div className="min-h-dvh bg-paper">{children}</div>;
  }

  return (
    <SiteContactProvider>
      <div className="flex min-h-dvh flex-col bg-paper">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </SiteContactProvider>
  );
}
