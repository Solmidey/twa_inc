import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type RevealStatus = "idle" | "pending" | "success" | "error";

export default function ProtectedReveal() {
  const router = useRouter();

  const reference = useMemo(() => {
    const q = router.query ?? {};
    const raw = (q.reference ?? q.trxref ?? q.ref ?? "") as string | string[];
    const value = Array.isArray(raw) ? raw[0] : raw;
    return typeof value === "string" ? value.trim() : "";
  }, [router.query]);

  const [status, setStatus] = useState<RevealStatus>("idle");
  const [message, setMessage] = useState("");
  const [invite, setInvite] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    if (!reference) {
      setStatus("error");
      setMessage("Missing payment reference.");
      return;
    }

    let cancelled = false;
    let tries = 0;

    const check = async () => {
      tries += 1;

      try {
        const res = await fetch(
          "/api/paystack/verify-transaction?reference=" + encodeURIComponent(reference)
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error ?? data?.message ?? "Unable to verify payment");
        }

        const nextStatus = data?.status ?? "unknown";
        const inviteUrl = data?.inviteUrl ?? "";

        if (nextStatus === "success") {
          if (inviteUrl) {
            if (cancelled) return;
            setInvite(inviteUrl);
            setStatus("success");
            setMessage("");
            return;
          }

          if (cancelled) return;
          setStatus("error");
          setMessage("Discord invite is not configured.");
          return;
        }

        if (tries >= 6) {
          if (cancelled) return;
          setStatus("error");
          setMessage("Payment not confirmed yet. If you just paid, refresh shortly.");
          return;
        }

        if (!cancelled) {
          setStatus("pending");
          setTimeout(check, 1800);
        }
      } catch (e: any) {
        if (cancelled) return;

        if (tries >= 3) {
          setStatus("error");
          setMessage(e?.message ?? "Something went wrong");
          return;
        }

        setStatus("pending");
        setTimeout(check, 1500);
      }
    };

    setStatus("pending");
    setMessage("");
    check();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, reference]);

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-3">
        <span className="inline-block h-3 w-3 rounded-full bg-amber-400" />
        <h3 className="text-lg font-semibold">Secure Discord access</h3>
      </div>

      <p className="mt-2 text-sm text-white/75">
        We verify your Paystack payment automatically. Once confirmed, your invite
        link is generated server-side and shown here for a short time.
      </p>

      <div className="mt-4 rounded-xl bg-black/20 p-4 text-sm">
        {status === "pending" && <p>Waiting for payment confirmation…</p>}
        {status === "error" && <p className="text-red-400">{message}</p>}
        {status === "success" && invite && (
          <a
            className="inline-flex items-center rounded-lg bg-brand-primary px-4 py-2 font-semibold text-white hover:opacity-90"
            href={invite}
            target="_blank"
            rel="noreferrer"
          >
            Open Discord invite
          </a>
        )}
      </div>
    </div>
  );
}
