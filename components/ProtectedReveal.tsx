import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type Status = "idle" | "pending" | "success" | "error";

export default function ProtectedReveal() {
  const router = useRouter();

  const reference = useMemo(() => {
    const q = router.query as Record<string, string | string[] | undefined>;
    const raw = q.reference ?? q.trxref ?? q.ref ?? "";
    const value = Array.isArray(raw) ? raw[0] : raw;
    return typeof value === "string" ? value : "";
  }, [router.query]);

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [invite, setInvite] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    if (!reference) {
      setStatus("error");
      setMessage("Missing transaction reference.");
      return;
    }

    let cancelled = false;
    let tries = 0;

    const check = async () => {
      tries += 1;

      try {
        setStatus("pending");
        setMessage("");

        const res = await fetch(
          "/api/paystack/verify-transaction?reference=" + encodeURIComponent(reference)
        );

        const data: any = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.error ?? data?.message ?? "Unable to verify payment");
        }

        const inviteUrl = data?.inviteUrl ?? "";

        if (inviteUrl) {
          if (cancelled) return;
          setInvite(inviteUrl);
          setStatus("success");
          return;
        }

        if (tries < 5 && !cancelled) {
          setTimeout(check, 1500);
        } else if (!cancelled) {
          setStatus("error");
          setMessage("Discord invite is not configured.");
        }
      } catch (err: unknown) {
        const e = err as { message?: string };

        if (cancelled) return;

        if (tries < 5) {
          setTimeout(check, 1500);
        } else {
          setStatus("error");
          setMessage(e?.message ?? "Something went wrong");
        }
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, reference]);

  if (status === "success" && invite) {
    return (
      <div className="mt-4">
        <a
          href={invite}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
        >
          Open Discord Invite
        </a>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {status === "pending" && <p>Waiting for payment confirmation…</p>}
      {status === "idle" && <p>Preparing verification…</p>}
      {status === "error" && (
        <p className="text-red-400">{message || "Unable to verify payment."}</p>
      )}
    </div>
  );
}
