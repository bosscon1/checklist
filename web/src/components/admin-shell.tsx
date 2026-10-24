import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { isStaffEmail, staffEmailError } from "@/lib/staff-email";
import { clearStaffSession, rememberCurrentStaffSession } from "@/lib/staff-session";
import { galleryMysqlStatus } from "@/lib/gallery.functions";
import { isLivePfeiferHost, phpBridgeStatus, type PhpBridgeUser } from "@/lib/php-bridge";
import { Logo } from "@/components/logo";

function MysqlBadge({ liveUser }: { liveUser: PhpBridgeUser | null }) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let live = true;
    const probe = isLivePfeiferHost()
      ? phpBridgeStatus().then((row) => Boolean(row?.mysql || row?.ok))
      : galleryMysqlStatus().then((row) => row.ok);
    void probe
      .then((connected) => {
        if (live) setOk(connected);
      })
      .catch(() => {
        if (live) setOk(false);
      });
    return () => {
      live = false;
    };
  }, [liveUser?.email]);

  const label = ok === null ? "MySQL…" : ok ? "MySQL connected" : "MySQL not connected";
  const color =
    ok === null ? "bg-paper/20 text-paper/80" : ok ? "bg-paper text-pfeifer" : "bg-danger text-paper";

  return (
    <span
      className={`inline-flex min-h-8 items-center px-2 font-sans text-[0.65rem] font-bold uppercase tracking-[0.12em] ${color}`}
      title={label}
    >
      {label}
    </span>
  );
}

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();
  const [phpUser, setPhpUser] = useState<PhpBridgeUser | null>(null);
  const [phpPending, setPhpPending] = useState(isLivePfeiferHost());
  const nodeAllowed = Boolean(user && isStaffEmail(user.primaryEmail));
  const allowed = nodeAllowed || Boolean(phpUser);
  const hadStaff = useRef(false);

  useEffect(() => {
    if (!isLivePfeiferHost()) {
      setPhpPending(false);
      return;
    }
    let live = true;
    void phpBridgeStatus().then((row) => {
      if (!live) return;
      setPhpUser(row?.user ?? null);
      setPhpPending(false);
    }).catch(() => {
      if (!live) return;
      setPhpUser(null);
      setPhpPending(false);
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (user && nodeAllowed) {
      hadStaff.current = true;
      rememberCurrentStaffSession();
    }
    if (!isPending && !user && !phpUser && hadStaff.current) {
      clearStaffSession();
      hadStaff.current = false;
    }
  }, [user, nodeAllowed, isPending, phpUser]);

  useEffect(() => {
    if (isPending || phpPending || !user || allowed) return;
    void signOut().catch(() => {});
  }, [isPending, phpPending, user, allowed]);

  if (isPending || phpPending) {
    return (
      <div className="min-h-dvh bg-cream">
        <div className="h-16 bg-pfeifer" />
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="h-8 w-48 animate-pulse bg-line" />
          <div className="mt-6 h-40 animate-pulse bg-paper" />
        </div>
      </div>
    );
  }

  if (!allowed) return <RedirectToSignIn to="/login/" />;

  const email = phpUser?.email || user?.primaryEmail || "";

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <header className="bg-pfeifer text-paper">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/admin/" className="flex items-center gap-3 text-paper no-underline">
            <Logo compact />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em]">
              Site admin
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <MysqlBadge liveUser={phpUser} />
            <Link to="/" className="font-sans text-sm text-paper/85 no-underline hover:text-paper">
              View public site
            </Link>
            {phpUser ? (
              <a href="/api/bridge/logout.php" className="font-sans text-sm text-paper no-underline">
                Sign out
              </a>
            ) : (
              <UserButton />
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        <p className="mt-2 text-sm text-muted">{email}</p>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

export { staffEmailError };
