import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type Status = "idle" | "pending" | "success" | "error";

export default function ProtectedReveal() {
  const router = useRouter();

  const reference = useMemo(() => {
    const q = (router.query ?? {}) as Record<string, string | string[] | undefined>;
    const raw = q.reference ?? q.trxref ?? q.ref ?? q.session_id ?? q.sessionId;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return typeof value === "string" ? value.trim() : "";
  }, [router.query]);

  const [status, setStatus] = useState<Status>("idle");
  const [inviteUrl, setInviteUrl] = useState("");
  const [message, setMessage] = useState("");

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

        const verifyUrl =
          "/api/paystack/verify-transaction?reference=" +
          encodeURIComponent(reference);

        const res = await fetch(verifyUrl);
        const data: any = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(
            data?.error ?? data?.message ?? "Unable to verify payment"
          );
        }

        const nextStatus =
          data?.status ?? data?.data?.status ?? data?.paymentStatus ?? "unknown";

        const invite =
          data?.inviteUrl ??
          data?.invite ??
          data?.discordInviteUrl ??
          "";

        if (nextStatus === "success") {
          if (!invite) {
            setStatus("error");
            setMessage("Discord invite is not configured.");
            return;
          }

          setInviteUrl(invite);
          setStatus("success");
          setMessage("");
          return;
        }

        if (tries >= 10) {
          setStatus("error");
          setMessage(
            "Payment not confirmed yet. If you just paid, refresh in a moment."
          );
          return;
        }
      } catch (e: any) {
        if (tries >= 3) {
          setStatus("error");
          setMessage(e?.message ?? "Something went wrong");
          return;
        }
      }

      if (!cancelled) {
        setTimeout(check, 1500);
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, reference]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" />
        <h3 className="text-lg font-semibold">Secure Discord access</h3>
      </div>

      <p className="text-sm text-white/70">
        We verify your Paystack payment automatically. Once confirmed, your
        invite link is generated server-side and shown here for a short time.
      </p>

      <div className="mt-4 rounded-xl bg-black/20 p-4">
        {status === "pending" && <p>Waiting for payment confirmation...</p>}

        {status === "error" && (
          <p className="text-red-400">
            {message || "Unable to verify payment"}
          </p>
        )}

        {status === "success" && inviteUrl && (
          <div className="space-y-2">
            <p className="text-green-300">Payment confirmed.</p>
            <Link
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Join the private Discord
            </Link>
            <p className="text-xs text-white/60">
              If this invite expires, contact support with your receipt email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
