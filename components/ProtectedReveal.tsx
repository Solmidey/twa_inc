import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type Status = "idle" | "pending" | "success" | "error";

type Props = {
  reference?: string;
  sessionId?: string; // backward compatibility
};

export default function ProtectedReveal({ reference, sessionId }: Props) {
  const router = useRouter();

  const ref = useMemo(() => {
    if (reference) return reference;
    if (sessionId) return sessionId;

    const q = router.query as any;
    const raw = q?.reference ?? q?.trxref ?? q?.ref ?? "";
    const value = Array.isArray(raw) ? raw[0] : raw;
    return typeof value === "string" ? value : "";
  }, [reference, sessionId, router.query]);

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");

  useEffect(() => {
    if (!ref) {
      setStatus("error");
      setMessage("Missing transaction reference.");
      return;
    }

    let cancelled = false; // TS-friendly noop alias
    let tries = 0;

    const check = async () => {
      tries += 1;
      setStatus("pending");
      setMessage("");

      try {
        const url = "/api/paystack/verify-transaction?reference=" + encodeURIComponent(ref);
        const res = await fetch(url);
        const data: any = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.error ?? data?.message ?? "Unable to verify payment");
        }

        const s = data?.status ?? data?.data?.status;

        if (s === "success") {
          const invite = data?.inviteUrl ?? "";
          setInviteUrl(invite);
          setStatus(invite ? "success" : "error");
          setMessage(invite ? "" : "Discord invite is not configured.");
          return;
        }

        if (tries < 8) {
          setTimeout(() => { if (!cancelled) check(); }, 2000);
          return;
        }

        setStatus("error");
        setMessage("Payment not confirmed yet. Please refresh shortly.");
      } catch (e: any) {
        if (tries < 3) {
          setTimeout(() => { if (!cancelled) check(); }, 1500);
          return;
        }
        setStatus("error");
        setMessage(e?.message ?? "Something went wrong");
      }
    };

    check();
    return () => { cancelled = true; };
  }, [ref]);

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6">
      {status === "pending" && <p>Waiting for payment confirmation…</p>}
      {status === "error" && <p className="text-red-300">{message}</p>}
      {status === "success" && inviteUrl && (
        <a href={inviteUrl} target="_blank" rel="noreferrer" className="underline">
          Open your private Discord invite
        </a>
      )}
    </div>
  );
}
