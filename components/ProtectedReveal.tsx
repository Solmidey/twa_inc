import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type UiStatus = "pending" | "success" | "error";

export default function ProtectedReveal() {
  const router = useRouter();

  const reference = useMemo(() => {
    const q = router.query as Record<string, string | string[] | undefined>;
    const raw = q.reference ?? q.trxref ?? q.ref ?? "";
    const value = Array.isArray(raw) ? raw[0] : raw;
    return typeof value === "string" ? value.trim() : "";
  }, [router.query]);

  const [status, setStatus] = useState<UiStatus>("pending");
  const [message, setMessage] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");

  useEffect(() => {
    if (!reference) return;

    let cancelled = false;
    let tries = 0;

    const check = async () => {
      tries += 1;

      try {
        const res = await fetch(
          "/api/paystack/verify-transaction?reference=" + encodeURIComponent(reference)
        );
        const data = await res.json().catch(() => ({} as any));

        if (!res.ok) {
          const errMsg =
            (data as any)?.error ?? (data as any)?.message ?? "Unable to verify payment";
          throw new Error(errMsg);
        }

        const paystackStatus = (data as any)?.data?.status ?? (data as any)?.status;
        const invite = (data as any)?.data?.inviteUrl ?? (data as any)?.inviteUrl ?? "";

        if (paystackStatus === "success") {
          setInviteUrl(invite);
          setStatus("success");
          setMessage(!invite ? "Discord invite is not configured." : "");
          return;
        }

        if (tries >= 10) {
          setStatus("error");
          setMessage("Payment not confirmed yet. If you just paid, refresh in a minute.");
          return;
        }

        if (!cancelled) setTimeout(check, 2500);
      } catch (err: unknown) {
        if (tries >= 3) {
          setStatus("error");
          setMessage(err instanceof Error ? err.message : "Something went wrong");
          return;
        }
        if (!cancelled) setTimeout(check, 2000);
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="mb-2 text-lg font-semibold">Secure Discord access</h3>
      <p className="mb-4 text-sm text-white/70">
        We verify your Paystack payment automatically. Once confirmed, your invite
        link is generated server-side and shown here for a short time.
      </p>

      {!reference && (
        <p className="text-sm text-red-400">Missing payment reference.</p>
      )}

      {reference && status === "pending" && (
        <p className="text-sm text-white/80">Waiting for payment confirmation...</p>
      )}

      {reference && status === "error" && (
        <p className="text-sm text-red-400">{message}</p>
      )}

      {reference && status === "success" && inviteUrl && (
        <div className="mt-2">
          <Link
            href={inviteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
          >
            Join the Private Discord
          </Link>
          <p className="mt-2 text-xs text-white/50">
            If this link expires, contact support or re-verify your payment.
          </p>
        </div>
      )}

      {reference && status === "success" && !inviteUrl && (
        <p className="text-sm text-red-400">{message}</p>
      )}
    </div>
  );
}
