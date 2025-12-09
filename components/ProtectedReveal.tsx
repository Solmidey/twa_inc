import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type RevealState = {
  status: "idle" | "pending" | "success" | "error";
  inviteUrl?: string;
  message?: string;
};

export default function ProtectedReveal() {
  const router = useRouter();
  const [state, setState] = useState<RevealState>({ status: "idle" });

  const reference = useMemo(() => {
    const q = router.query as any;
    const raw = q?.reference ?? q?.trxref ?? q?.ref ?? "";
    const value = Array.isArray(raw) ? raw[0] : raw;
    return typeof value === "string" ? value : "";
  }, [router.query]);

  useEffect(() => {
    if (!router.isReady) return;

    if (!reference) {
      setState({ status: "error", message: "Missing transaction reference." });
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
          throw new Error((data as any)?.error ?? (data as any)?.message ?? "Unable to verify payment");
        }

        const status = (data as any)?.status;

        if (status === "success") {
          const invite = (data as any)?.inviteUrl ?? "";
          if (cancelled) return;

          setState({
            status: "success",
            inviteUrl: invite,
            message: invite ? "" : "Discord invite is not configured.",
          });
          return;
        }

        if (tries >= 6) {
          if (cancelled) return;
          setState({ status: "error", message: "Payment not confirmed yet. Please refresh shortly." });
          return;
        }

        setTimeout(check, 1500);
      } catch (e: any) {
        if (tries >= 3) {
          if (cancelled) return;
          setState({ status: "error", message: e?.message ?? "Something went wrong" });
          return;
        }
        setTimeout(check, 1200);
      }
    };

    setState({ status: "pending" });
    check();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, reference]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-2 text-sm font-semibold tracking-wide text-white/70">
        Secure Discord access
      </div>
      <p className="text-sm text-white/70">
        We verify your Paystack payment automatically. Once confirmed, your invite link is generated server-side
        and shown here for a short time.
      </p>

      <div className="mt-4 rounded-xl bg-black/20 p-4">
        {state.status === "pending" && <p className="text-sm text-white/80">Waiting for payment confirmation...</p>}

        {state.status === "error" && (
          <p className="text-sm text-red-300">{state.message ?? "Unable to confirm payment."}</p>
        )}

        {state.status === "success" && state.inviteUrl && (
          <a
            className="inline-flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
            href={state.inviteUrl}
            target="_blank"
            rel="noreferrer"
          >
            Join the private Discord
          </a>
        )}

        {state.status === "success" && !state.inviteUrl && (
          <p className="text-sm text-red-300">{state.message ?? "Discord invite is not configured."}</p>
        )}
      </div>
    </div>
  );
}
