import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

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
  const [invite, setInvite] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!reference) return;

    let cancelled = false;
    let tries = 0;

    setStatus("pending");
    setInvite("");
    setMessage("");

    const check = async () => {
      if (cancelled) return;

      try {
        const res = await fetch(
          "/api/paystack/verify-transaction?reference=" + encodeURIComponent(reference)
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error((data as any)?.error ?? (data as any)?.message ?? "Unable to verify payment");
        }

        const nextStatus = (data as any)?.status;

        if (nextStatus === "success") {
          const inviteUrl = String((data as any)?.inviteUrl ?? "");
          setInvite(inviteUrl);
          setStatus("success");
          setMessage(inviteUrl ? "" : "Discord invite is not configured.");
          return;
        }

        tries += 1;
        if (tries >= 10) {
          setStatus("error");
          setMessage("Payment not confirmed yet. If you just paid, refresh in a moment.");
          return;
        }

        setTimeout(check, 1500);
      } catch (e: any) {
        tries += 1;
        if (tries >= 3) {
          setStatus("error");
          setMessage(e?.message ?? "Something went wrong");
          return;
        }
        setTimeout(check, 1500);
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [reference]);

  if (!reference) {
    return (
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-slate-200">Missing transaction reference.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
      {status === "pending" && <p className="text-sm text-slate-200">Waiting for payment confirmation...</p>}

      {status === "error" && message && (
        <p className="text-sm text-red-400">{message}</p>
      )}

      {status === "success" && invite && (
        <div className="space-y-2">
          <p className="text-sm text-slate-200">Payment confirmed.</p>
          <a
            href={invite}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Join the private Discord
          </a>
        </div>
      )}

      {status === "success" && !invite && (
        <p className="text-sm text-red-400">{message || "Discord invite is not configured."}</p>
      )}
    </div>
  );
}
