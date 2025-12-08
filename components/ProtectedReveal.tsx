import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type Status = "idle" | "pending" | "paid" | "revealed" | "error";
type RevealResponse = { inviteUrl?: string; invite?: string; url?: string; error?: string; message?: string };
type VerifyResponse = { paid?: boolean; status?: string; error?: string; message?: string };

export function ProtectedReveal() {
  const router = useRouter();

  const reference = useMemo(() => {
    const q = router.query as Record<string, any>;
    const v = q.reference ?? q.ref ?? q.session_id ?? q.sessionId ?? "";
    return Array.isArray(v) ? (v[0] ?? "") : String(v ?? "");
  }, [router.query]);

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [invite, setInvite] = useState<string>("");

  useEffect(() => {
    if (!router.isReady) return;

    if (!reference) {
      setStatus("error");
      setMessage("Missing payment reference.");
      return;
    }

    let cancelled = false;
    let tries = 0;

    const poll = async () => {
      tries += 1;

      try {
        if (tries === 1) {
          setStatus("pending");
          setMessage("");
          setInvite("");
        }

        const verifyUrl = "/api/reveal?reference=" + encodeURIComponent(reference);
        const vRes = await fetch(verifyUrl);
        const vData: VerifyResponse = await vRes.json().catch(() => ({} as any));

        if (!vRes.ok) {
          throw new Error(vData?.error ?? vData?.message ?? "Verification failed");
        }

        if (vData?.paid) {
          const revealUrl = "/api/reveal?reference=" + encodeURIComponent(reference) + "&session_id=" + encodeURIComponent(reference);
          const rRes = await fetch(revealUrl);
          const rData: RevealResponse = await rRes.json().catch(() => ({} as any));
          const link = rData?.inviteUrl ?? rData?.invite ?? rData?.url;

          if (rRes.ok && link) {
            setInvite(link);
            setStatus("revealed");
            setMessage("");
            return;
          }

          setStatus("paid");
          setMessage(rData?.message ?? "Payment confirmed. Your Discord link will appear here shortly.");
          return;
        }

        if (tries >= 40) {
          setStatus("error");
          setMessage("Payment not confirmed yet. If you were charged, please contact support.");
          return;
        }

        setStatus("pending");
      } catch (e) {
        if (tries >= 3) {
          setStatus("error");
          setMessage((e as any)?.message ?? "Something went wrong");
          return;
        }
      }

      if (!cancelled) setTimeout(poll, 3000);
    };

    poll();
    return () => { cancelled = true; };
  }, [router.isReady, reference]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" />
        <h3 className="text-lg font-semibold">Secure Discord access</h3>
      </div>

      <p className="text-sm text-white/70">
        We verify your Paystack payment automatically. Once confirmed, your invite
        link is generated server-side and shown here for a short time.
      </p>

      <div className="mt-4 rounded-xl bg-black/20 p-4 text-sm">
        {status === "pending" && <p>Waiting for payment confirmation...</p>}
        {status === "paid" && <p>{message || "Payment confirmed."}</p>}
        {status === "error" && <p className="text-red-300">{message || "Verification error"}</p>}
        {status === "revealed" && invite && (
          <a className="underline" href={invite} target="_blank" rel="noreferrer">
            Open your private Discord invite
          </a>
        )}
      </div>
    </div>
  );
}

export default ProtectedReveal;