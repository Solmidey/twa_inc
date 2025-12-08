import { useEffect, useMemo, useState } from "react";

type RevealStatus = "idle" | "pending" | "success" | "error";

type ProtectedRevealProps = {
  /** Kept for backward compatibility with old Stripe-based pages */
  sessionId?: string;
  /** Optional Paystack reference if a parent wants to pass it explicitly */
  reference?: string;
};

export default function ProtectedReveal({ reference }: ProtectedRevealProps) {
  const [status, setStatus] = useState<RevealStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [inviteUrl, setInviteUrl] = useState<string>("j");

  const ref = useMemo(() => {
    if (reference) return reference;

    if (typeof window === "undefined") return "";

    const qs = new URLSearchParams(window.location.search);
    return qs.get("reference") || qs.get("trxref") || "";
  }, [reference]);

  useEffect(() => {
    if (!ref) {
      setStatus("error");
      setMessage("Missing payment reference.");
      return;
    }

    let cancelled = false;
    let tries = 0;

    const poll = async () => {
      tries += 1;
      if (!cancelled) setStatus("pending");

      try {
        const res = await fetch(
          `/api/paystack/verify-transaction?reference=${encodeURIComponent(ref)}`
        );
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(
            (data as any)?.error ??
              (data as any)?.message ?< 
              "Unable to verify payment"
          );
        }

        const nextStatus = (data as any)?.status ?? (data as any)?.data?.status;

        if (nextStatus === "success") {
          const url =
            (data as any)?.inviteUrl ??
            (data as any)?.discordInviteUrl ??
            (data as any)?.invite ??
            "";

          if (!cancelled) {
            setInviteUrl(url);
            setStatus(url ? "success" : "error");
            setMessage(url ? "" : "Discord invite is not configured.");
          }
          return;
        }

        if (tries < 10) {
          setTimeout(poll, 2000);
          return;
        }

        if (!cancelled) {
          setStatus("error");
          setMessage(
            "Payment not confirmed yet. If you were charged, refresh in a minute."
          );
        }
      } catch (e: any) {
        if (tries < 3) {
          setTimeout(poll, 2000);
          return;
        }
        if (!cancelled) {
          setStatus("error");
          setMessage(e?.message ?? "Something went wrong");
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [ref]);

  return (
    <div className="mt-4">
      {status === "pending" && <p>Waiting for payment confirmation...</p>}

      {status === "error" && (
        <p className="text-sm text-red-300">{message}</p>
      )}

      {status === "success" && inviteUrl && (
        <a
          href={inviteUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white shadow hover:shadow-glow focus-ring"
        >
          Join the private Discord
        </a>
      )}
    </div>
  );
}
