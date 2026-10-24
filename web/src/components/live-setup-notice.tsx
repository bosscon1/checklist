import { useCallback, useEffect, useState } from "react";
import {
  isLivePfeiferHost,
  phpBridgeReady,
  phpBridgeStatus,
  type PhpBridgeStatus,
} from "@/lib/php-bridge";

function Row({ ok, label, detail }: { ok: boolean; label: string; detail?: string }) {
  return (
    <li className="border-t border-line py-2">
      <p className={`text-sm font-semibold ${ok ? "text-pfeifer" : "text-danger"}`}>
        {ok ? "Pass" : "Needs setup"} — {label}
      </p>
      {detail && !ok ? <p className="mt-1 text-sm text-muted">{detail}</p> : null}
    </li>
  );
}

export function LiveSetupNotice({
  onStatus,
}: {
  onStatus?: (status: PhpBridgeStatus | null) => void;
}) {
  const [status, setStatus] = useState<PhpBridgeStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [ran, setRan] = useState(false);

  const verify = useCallback(async () => {
    if (!isLivePfeiferHost()) return;
    setBusy(true);
    const row = await phpBridgeStatus();
    setStatus(row);
    setRan(true);
    setBusy(false);
    onStatus?.(row);
  }, [onStatus]);

  useEffect(() => {
    void verify();
  }, [verify]);

  if (!isLivePfeiferHost()) return null;

  const ready = phpBridgeReady(status);
  const php = Boolean(status?.php);
  const config = Boolean(status?.config_file);
  const password = Boolean(status?.password_set);
  const mysql = Boolean(status?.mysql);
  const google = Boolean(status?.google);

  return (
    <div className={`border p-5 ${ready ? "border-line bg-paper" : "border-danger bg-paper"}`}>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Live SiteGround admin
      </p>
      <h2 className="mt-2 font-display text-2xl text-ink">
        {ready ? "Setup verified — admin can save" : "Admin saves are disabled until setup is finished"}
      </h2>
      <p className="mt-2 text-sm text-muted">
        Cover, order, and header darkness save to MySQL on this server. That only works after
        <code className="mx-1">config.php</code>
        and Google sign-in are in place. Full steps are in the project README.
      </p>
      {status?.error ? <p className="mt-2 text-sm text-danger">{status.error}</p> : null}
      {ran ? (
        <ul className="mt-4">
          <Row
            ok={php}
            label="PHP bridge is running"
            detail="Upload public/api/bridge/ into the SiteGround web root so .php files execute (not download)."
          />
          <Row
            ok={config}
            label="config.php exists"
            detail="In File Manager copy api/bridge/config.sample.php to api/bridge/config.php. Do not put that file on GitHub."
          />
          <Row
            ok={password}
            label="MySQL password is set"
            detail="Replace CHANGE_ME in config.php with the real MySQL password. Host must be localhost."
          />
          <Row
            ok={mysql}
            label="MySQL connected on localhost"
            detail={status?.mysql_error || "User must have rights on database dbeemfkinruaxd."}
          />
          <Row
            ok={google}
            label="Google sign-in keys are set"
            detail="Google Cloud → OAuth client (Web). Redirect: https://pfeiferbuild.com/api/bridge/google-callback.php. Paste client ID and secret into config.php."
          />
        </ul>
      ) : null}
      <button
        type="button"
        className="mt-4 min-h-12 bg-pfeifer px-5 font-sans text-sm font-bold uppercase tracking-wide text-paper hover:bg-pfeifer-dark disabled:opacity-60"
        disabled={busy}
        onClick={() => void verify()}
      >
        {busy ? "Checking…" : "Verify setup"}
      </button>
    </div>
  );
}
