import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  sortChecklistItems,
  type ChecklistItem,
  type ChecklistStatus,
} from "@/lib/checklist";

const OWNER_KEY = "checklist-owner-key";

export const Route = createFileRoute("/checklist/")({
  head: () => ({
    meta: [
      { title: "Checklist" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "theme-color", content: "#1c1f24" },
      { name: "apple-mobile-web-app-title", content: "Checklist" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      { name: "description", content: "A personal checklist you can check, dismiss, and add to from your phone." },
    ],
    links: [
      { rel: "manifest", href: "/checklist/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/checklist/icon-180.png" },
    ],
  }),
  component: ChecklistPage,
});

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function ChecklistPage() {
  const [ownerKey, setOwnerKey] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOwnerKey(window.localStorage.getItem(OWNER_KEY));
    setReady(true);
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/checklist-sw.js", { scope: "/checklist/" }).catch(() => {});
    }
  }, []);

  if (!ready) {
    return <Frame title="Checklist" />;
  }
  if (!ownerKey) {
    return (
      <KeyGate
        onSave={(value) => {
          window.localStorage.setItem(OWNER_KEY, value);
          setOwnerKey(value);
        }}
      />
    );
  }
  return (
    <ChecklistApp
      ownerKey={ownerKey}
      onLock={() => {
        window.localStorage.removeItem(OWNER_KEY);
        setOwnerKey(null);
      }}
      onUnauthorized={() => {
        window.localStorage.removeItem(OWNER_KEY);
        setOwnerKey(null);
      }}
    />
  );
}

function Frame({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-cream text-ink [&_button]:touch-manipulation [&_input]:touch-manipulation [&_summary]:touch-manipulation">
      <header className="px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <h1 className="font-display text-3xl">{title}</h1>
      </header>
      <div className="flex-1 px-4">{children}</div>
    </main>
  );
}

function KeyGate({ onSave }: { onSave: (key: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = value.trim();
    if (!next) {
      setError("Enter the checklist key.");
      return;
    }
    onSave(next);
  }

  return (
    <Frame title="Checklist">
      <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
        <p className="text-lg text-muted">
          Enter the owner key once. It stays on this phone, and every tap saves straight to your list.
        </p>
        <label className="flex flex-col gap-2 text-base font-semibold" htmlFor="checklist-key">
          Owner key
          <input
            id="checklist-key"
            type="password"
            autoComplete="current-password"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError("");
            }}
            className="min-h-16 rounded border border-line bg-paper px-4 text-lg font-normal"
          />
        </label>
        {error ? (
          <p className="text-base text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="min-h-16 rounded bg-pfeifer px-4 text-lg font-semibold text-paper">
          Open checklist
        </button>
      </form>
    </Frame>
  );
}

function ChecklistApp({
  ownerKey,
  onLock,
  onUnauthorized,
}: {
  ownerKey: string;
  onLock: () => void;
  onUnauthorized: () => void;
}) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [install, setInstall] = useState<InstallPrompt | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);
  const itemsRef = useRef(items);
  const inflight = useRef(new Set<string>());
  itemsRef.current = items;

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const sync = () => setStandalone(media.matches || nav.standalone === true);
    sync();
    media.addEventListener("change", sync);
    setIos(/iphone|ipad|ipod/i.test(window.navigator.userAgent));
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstall(event as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function refresh(quiet = false) {
      const response = await fetch("/api/checklist/", {
        headers: { authorization: `Bearer ${ownerKey}` },
      });
      const body = (await response.json().catch(() => ({}))) as { items?: ChecklistItem[]; error?: string };
      if (cancelled) return;
      if (response.status === 401) {
        onUnauthorized();
        return;
      }
      if (!response.ok || !Array.isArray(body.items)) {
        if (!quiet) setError(body.error || "Couldn't load the list.");
        setLoaded(true);
        return;
      }
      setItems((current) => {
        const pending = inflight.current;
        const temps = current.filter((item) => item.id.startsWith("tmp-"));
        const merged = body.items!.map((item) => {
          if (!pending.has(item.id)) return item;
          return current.find((row) => row.id === item.id) ?? item;
        });
        return sortChecklistItems([...merged, ...temps]);
      });
      setLoaded(true);
      setError("");
    }
    void refresh();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh(true);
    }, 8000);
    const onFocus = () => void refresh(true);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [onUnauthorized, ownerKey]);

  async function send(path: string, init: RequestInit): Promise<{ ok: true; item: ChecklistItem } | { ok: false; status: number; error: string }> {
    const response = await fetch(path, {
      ...init,
      headers: {
        authorization: `Bearer ${ownerKey}`,
        "content-type": "application/json",
        ...(init.headers ?? {}),
      },
    });
    const body = (await response.json().catch(() => ({}))) as { item?: ChecklistItem; error?: string };
    if (response.status === 401) {
      onUnauthorized();
      return { ok: false, status: 401, error: "That key doesn't match." };
    }
    if (!response.ok || !body.item) {
      return { ok: false, status: response.status, error: body.error || "Couldn't save that change." };
    }
    return { ok: true, item: body.item };
  }

  function replace(id: string, next: ChecklistItem | null) {
    setItems((current) => {
      const without = current.filter((item) => item.id !== id);
      return sortChecklistItems(next ? [...without, next] : without);
    });
  }

  async function setStatus(item: ChecklistItem, status: ChecklistStatus) {
    const previous = itemsRef.current.find((row) => row.id === item.id) ?? item;
    const optimistic = { ...previous, status, statusSource: "user" as const, updatedAt: new Date().toISOString() };
    replace(item.id, optimistic);
    inflight.current.add(item.id);
    const result = await send(`/api/checklist/${encodeURIComponent(item.id)}/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    inflight.current.delete(item.id);
    if (!result.ok) {
      replace(item.id, previous);
      setError(result.error);
      return;
    }
    const latest = itemsRef.current.find((row) => row.id === item.id);
    if (!latest || latest.status === status) replace(item.id, result.item);
    setError("");
  }

  async function addItem(event: FormEvent) {
    event.preventDefault();
    const text = draft.replace(/\s+/g, " ").trim();
    if (!text) return;
    const tempId = `tmp-${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const optimistic: ChecklistItem = {
      id: tempId,
      text,
      status: "open",
      source: "user",
      statusSource: "user",
      botKey: null,
      createdAt: now,
      updatedAt: now,
    };
    setDraft("");
    setItems((current) => sortChecklistItems([...current, optimistic]));
    inflight.current.add(tempId);
    const result = await send("/api/checklist/", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    inflight.current.delete(tempId);
    if (!result.ok) {
      replace(tempId, null);
      setDraft(text);
      setError(result.error);
      return;
    }
    replace(tempId, result.item);
    setError("");
  }

  const open = items.filter((item) => item.status === "open");
  const done = items.filter((item) => item.status === "done");
  const dismissed = items.filter((item) => item.status === "dismissed");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-cream text-ink [&_button]:touch-manipulation [&_input]:touch-manipulation [&_summary]:touch-manipulation">
      <header className="flex items-end justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <div>
          <h1 className="font-display text-3xl">Checklist</h1>
          <p className="mt-1 text-base text-muted">{loaded ? `${open.length} open` : "Loading"}</p>
        </div>
        <button type="button" onClick={onLock} className="min-h-14 px-2 text-base font-semibold text-muted">
          Lock
        </button>
      </header>

      {error ? (
        <p className="mx-4 mt-3 rounded border border-danger px-3 py-3 text-base text-danger" role="alert">
          {error}
        </p>
      ) : null}

      {!standalone ? <InstallHint ios={ios} install={install} onInstalled={() => setInstall(null)} /> : null}

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loaded && open.length === 0 ? (
          <p className="mt-6 text-lg text-muted">Nothing open. Add one below, or wait for your bot.</p>
        ) : null}
        <ItemList items={open} onStatus={setStatus} />
        {done.length > 0 ? (
          <section className="mt-8">
            <h2 className="font-display text-xl">Done</h2>
            <ItemList items={done} onStatus={setStatus} />
          </section>
        ) : null}
        {dismissed.length > 0 ? (
          <details className="mt-8">
            <summary className="min-h-14 cursor-pointer py-3 text-lg font-semibold">
              Dismissed ({dismissed.length})
            </summary>
            <ul className="divide-y divide-line border-t border-line">
              {dismissed.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2">
                  <p className="min-h-14 flex-1 py-3 text-lg text-muted">{item.text}</p>
                  <button
                    type="button"
                    onClick={() => void setStatus(item, "open")}
                    className="min-h-14 px-3 text-base font-semibold text-pfeifer"
                  >
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>

      <form
        onSubmit={(event) => void addItem(event)}
        className="flex items-stretch gap-2 border-t border-line bg-paper px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <label className="sr-only" htmlFor="checklist-new">
          New item
        </label>
        <input
          id="checklist-new"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add an item"
          enterKeyHint="done"
          maxLength={280}
          className="min-h-16 min-w-0 flex-1 rounded border border-line bg-paper px-4 text-lg"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="min-h-16 rounded bg-pfeifer px-5 text-lg font-semibold text-paper disabled:opacity-40"
        >
          Add
        </button>
      </form>
    </main>
  );
}

function ItemList({
  items,
  onStatus,
}: {
  items: ChecklistItem[];
  onStatus: (item: ChecklistItem, status: ChecklistStatus) => void;
}) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-2 divide-y divide-line border-t border-line">
      {items.map((item) => {
        const done = item.status === "done";
        return (
          <li key={item.id} className="flex items-stretch gap-2 py-2">
            <button
              type="button"
              aria-pressed={done}
              aria-label={done ? `Mark not done: ${item.text}` : `Mark done: ${item.text}`}
              onClick={() => onStatus(item, done ? "open" : "done")}
              className={`grid size-16 shrink-0 place-items-center rounded border-2 ${
                done ? "border-pfeifer bg-pfeifer text-paper" : "border-ink bg-paper text-ink"
              }`}
            >
              {done ? <CheckMark /> : <span className="sr-only">Open</span>}
            </button>
            <button
              type="button"
              onClick={() => onStatus(item, done ? "open" : "done")}
              className="min-h-16 flex-1 px-1 text-left"
            >
              <span className={`block text-lg ${done ? "text-muted line-through" : ""}`}>{item.text}</span>
              {item.source === "bot" ? (
                <span className="mt-1 block text-sm text-muted">
                  {done && item.statusSource === "bot" ? "Checked by your bot" : "From your bot"}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => onStatus(item, "dismissed")}
              className="min-h-16 shrink-0 px-2 text-base font-semibold text-danger"
            >
              Dismiss
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function InstallHint({
  ios,
  install,
  onInstalled,
}: {
  ios: boolean;
  install: InstallPrompt | null;
  onInstalled: () => void;
}) {
  return (
    <section className="mx-4 mt-4 rounded border border-line bg-paper px-4 py-3">
      <h2 className="text-base font-semibold">Keep it on your home screen</h2>
      {install ? (
        <button
          type="button"
          className="mt-3 min-h-14 w-full rounded bg-ink text-base font-semibold text-paper"
          onClick={() => {
            void install.prompt().then(() => install.userChoice).then(onInstalled);
          }}
        >
          Add to Home Screen
        </button>
      ) : (
        <p className="mt-2 text-base text-muted">
          {ios
            ? "Tap Share, then Add to Home Screen. The icon opens this list."
            : "Open the browser menu and choose Add to Home Screen. The icon opens this list."}
        </p>
      )}
    </section>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-8" aria-hidden="true">
      <path
        d="M5 12.5 9.5 17 19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
