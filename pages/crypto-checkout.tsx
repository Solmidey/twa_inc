import Head from "next/head";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { plans, getPlan } from "@/lib/plans";
import { CRYPTO_METHODS, getCryptoMethod, getRequiredUsdtAmount } from "@/lib/crypto";

function parseUsd(planId?: string) {
  if (!planId) return null;
  const plan = getPlan(planId);
  if (!plan) return null;

  const raw =
    (plan as any).priceUsd ??
    (plan as any).amountUsd ??
    (typeof (plan as any).price === "string"
      ? Number(String((plan as any).price).replace(/[^0-9.]/g, ""))
      : Number((plan as any).price ?? 0));

  const usd = Number(raw);
  if (!Number.isFinite(usd) || usd <= 0) return null;
  return usd;
}

export default function CryptoCheckout() {
  const router = useRouter();
  const planId = String(router.query.planId ?? "monthly");

  const plan = useMemo(() => getPlan(planId) ?? plans[0], [planId]);
  const [methodId, setMethodId] = useState(CRYPTO_METHODS[0].id);
  const [txHash, setTxHash] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ethUsd, setEthUsd] = useState<number | null>(null);

  const receiver = process.env.NEXT_PUBLIC_CRYPTO_EVM_ADDRESS;

  useEffect(() => {
    // fetch ETH USD rate for UI quote only
    fetch("/api/crypto/rates")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && d?.ethUsd) setEthUsd(Number(d.ethUsd));
      })
      .catch(() => {});
  }, []);

  const usd = parseUsd(plan?.id);
  const selected = getCryptoMethod(methodId);

  const stableAmount = useMemo(() => {
    if (!plan?.id) return null;
    return getRequiredUsdtAmount(plan.id);
  }, [plan?.id]);

  const ethEstimate = useMemo(() => {
    if (!usd || !ethUsd) return null;
    const est = usd / ethUsd;
    if (!Number.isFinite(est) || est <= 0) return null;
    return est;
  }, [usd, ethUsd]);

  const handleVerify = async () => {
    if (!plan?.id) return;
    if (!selected) return;

    if (!txHash) {
      setMessage("Please paste your transaction hash.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/crypto/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, methodId: selected.id, txHash }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok || !data?.token) {
        setMessage(data?.error ?? "Unable to verify payment.");
        return;
      }

      router.push(`/crypto-reveal?token=${encodeURIComponent(data.token)}`);
    } catch (e) {
      setMessage("Verification error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-contrast">
      <Head>
        <title>Crypto Checkout | TWA Inc.</title>
        <meta
          name="description"
          content="Pay with crypto to unlock private Discord access."
        />
      </Head>

      <Navbar />

      <main id="main" className="section-padding">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-white/10 bg-white/70 p-8 shadow-lg dark:bg-white/5">
            <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
              Crypto payment
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              Subscribe to unlock the private Discord
            </h1>

            <p className="mt-3 text-slate-700 dark:text-slate-200">
              You’re paying for <span className="font-semibold">{plan.name}</span>.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-sm font-semibold text-red-400">
                Important
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                Send <span className="font-semibold">only</span> on the selected network.
                Wrong network = funds may be lost.
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                Double-check the address and token before you confirm your transfer.
              </p>
            </div>

            <div className="mt-8">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Choose currency & network
              </label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {CRYPTO_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethodId(m.id)}
                    className={[
                      "rounded-xl border px-4 py-3 text-left text-sm transition focus-ring",
                      methodId === m.id
                        ? "border-brand-primary bg-brand-primary/10"
                        : "border-white/10 bg-white/60 hover:bg-white/80 dark:bg-white/5",
                    ].join(" ")}
                  >
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {m.label}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      Network: {m.chain}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/60 p-4 dark:bg-white/5">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Send to this address
              </p>
              <p className="mt-2 break-all rounded-lg bg-black/20 p-3 text-sm">
                {receiver || "Set NEXT_PUBLIC_CRYPTO_EVM_ADDRESS"}
              </p>

              <div className="mt-3 text-sm text-slate-700 dark:text-slate-200">
                {selected?.asset === "USDT" && stableAmount && (
                  <p>
                    Amount to send: <span className="font-semibold">{stableAmount} USDT</span>
                  </p>
                )}
                {selected?.asset === "ETH" && usd && (
                  <p>
                    Plan value: <span className="font-semibold">${usd}</span>
                    {ethEstimate && (
                      <>
                        {" "}≈{" "}
                        <span className="font-semibold">
                          {ethEstimate.toFixed(6)} ETH
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <label
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
                htmlFor="txHash"
              >
                Paste transaction hash
              </label>
              <input
                id="txHash"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="0x..."
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-ring dark:bg-white/5 dark:text-white"
              />
            </div>

            {message && <p className="mt-3 text-sm text-red-500">{message}</p>}

            <button
              type="button"
              disabled={submitting}
              onClick={handleVerify}
              className={[
                "mt-6 w-full rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow hover:shadow-glow focus-ring",
                submitting ? "opacity-70 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {submitting ? "Verifying..." : "I have paid"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
