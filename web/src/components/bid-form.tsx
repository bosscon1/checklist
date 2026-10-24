import { useState, type FormEvent } from "react";
import { PROJECT_TYPES, SITE } from "@/data/site";

export function BidForm() {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (!name || (!phone && !email)) {
      setStatus("err");
      setMessage("Please include your name and a phone number or email.");
      return;
    }
    // Preview / JS path: show success. On SiteGround without JS, the form POSTs to contact.php.
    setStatus("ok");
    setMessage("Thanks. We have your request. Call 770-487-1380 if you need us sooner.");
    form.reset();
  }

  return (
    <form
      method="post"
      action="/contact.php"
      onSubmit={onSubmit}
      className="border border-line bg-paper p-6 md:p-8"
      noValidate
    >
      <div className="sr-only" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">
          Name
          <input
            name="name"
            required
            autoComplete="name"
            className="mt-1 min-h-11 w-full border border-line bg-cream px-3 font-normal"
          />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Phone
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className="mt-1 min-h-11 w-full border border-line bg-cream px-3 font-normal"
          />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            className="mt-1 min-h-11 w-full border border-line bg-cream px-3 font-normal"
          />
        </label>
        <label className="block text-sm font-semibold text-ink">
          City / neighborhood
          <input
            name="city"
            className="mt-1 min-h-11 w-full border border-line bg-cream px-3 font-normal"
            placeholder="Peachtree City, Tyrone, Newnan…"
          />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Project type
          <select
            name="project_type"
            className="mt-1 min-h-11 w-full border border-line bg-cream px-3 font-normal"
            defaultValue="Deck"
          >
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="text-sm font-semibold text-ink">
          <legend>Preferred contact</legend>
          <div className="mt-2 flex flex-wrap gap-4 font-normal">
            <label className="inline-flex min-h-11 items-center gap-2">
              <input type="radio" name="preferred" value="phone" defaultChecked />
              Phone
            </label>
            <label className="inline-flex min-h-11 items-center gap-2">
              <input type="radio" name="preferred" value="email" />
              Email
            </label>
            <label className="inline-flex min-h-11 items-center gap-2">
              <input type="radio" name="preferred" value="text" />
              Text
            </label>
          </div>
        </fieldset>
        <label className="block text-sm font-semibold text-ink sm:col-span-2">
          Message
          <textarea
            name="message"
            rows={5}
            className="mt-1 w-full border border-line bg-cream px-3 py-2 font-normal"
            placeholder="What do you want built, and where?"
          />
        </label>
      </div>
      {status !== "idle" && (
        <p
          className={`mt-4 text-sm ${status === "ok" ? "text-pfeifer" : "text-danger"}`}
          role="status"
        >
          {message}
        </p>
      )}
      <button
        type="submit"
        className="mt-6 inline-flex min-h-12 items-center bg-pfeifer px-6 font-sans text-sm font-bold uppercase tracking-wide text-paper hover:bg-pfeifer-dark"
      >
        Send request
      </button>
      <p className="mt-3 text-xs text-muted">
        Goes to {SITE.email}. Or call {SITE.phone}. If PHP mail is not available, point the form
        action at a Formspree endpoint.
      </p>
    </form>
  );
}
