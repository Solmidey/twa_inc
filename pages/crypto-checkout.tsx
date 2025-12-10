import Head from "next/head";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { plans, getPlan } from "@/lib/plans";
import { CRYPTO_METHODS, getPlanUsd } from "@/lib/crypto";

export default function CryptoCheckout() {
  const router = useRouter();
  const planId = String(router.query.planId ?? "monthly");
  const initialEmail = String(router.query.email ?? "");

  const plan = useMemo(() => getPlan(planId) ?? plans[0], [planId]);
  const [email, setEmail] = useState(initialEmail);
  const [methodId, setMethodId] = useState(CRYPTO_METHODS[0].id);
  const [txHash, setTxHash] = useState("");
  const [message, setMessage] = useState("");
  const [ethUsd, setEthUsd] = useState<number | null>(null);
  const [ackOne, setAckOne] = useState(false);
  const [ackTwo, setAckTwo] = useState(false);

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

  const usd = getPlanUsd(plan?.id);
  const selected = CRYPTO_METHODS.find((m) => m.id === methodId);

  const stableAmount = useMemo(() => {
    if (!plan?.id) return null;
    return getPlanUsd(plan.id);
  }, [plan?.id]);

  const ethEstimate = useMemo(() => {
    if (!usd || !ethUsd) return null;
    const est = usd / ethUsd;
    if (!Number.isFinite(est) || est <= 0) return null;
    return est;
  }, [usd, ethUsd]);

  const handleConfirm = () => {
    if (!plan?.id || !selected) return;

    if (!email) {
      setMessage("Please provide your email so we can deliver access.");
      return;
    }

    if (!txHash) {
      setMessage("Please paste your transaction hash.");
      return;
    }

    setMessage("");
    router.push(
      `/crypto-reveal?planId=${encodeURIComponent(plan.id)}&chain=${encodeURIComponent(
        selected.chain
      )}&currency=${encodeURIComponent(selected.currency)}&txHash=${encodeURIComponent(
        txHash
      )}&email=${encodeURIComponent(email)}`
    );
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

            <div className="mt-6 text-sm text-slate-700 dark:text-slate-200">
              <p>
                Plan price: <span className="font-semibold">${usd?.toFixed(2)}</span>
              </p>
              {selected?.currency === "USDT" && stableAmount && (
                <p className="mt-1">
                  Send exactly <span className="font-semibold">{stableAmount} USDT</span> on
                  {" "}
                  <span className="font-semibold">{selected.chain}</span>
                </p>
              )}
              {selected?.currency === "ETH" && ethEstimate && (
                <p className="mt-1">
                  Send ≈ <span className="font-semibold">{ethEstimate.toFixed(6)} ETH</span> on
                  {" "}
                  <span className="font-semibold">{selected.chain}</span>
                </p>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/60 p-4 dark:bg-white/5">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Send to this address
              </p>
              <p className="mt-2 break-all rounded-lg bg-black/20 p-3 text-sm">
                {receiver || "Set NEXT_PUBLIC_CRYPTO_EVM_ADDRESS"}
              </p>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                Always copy-paste the address. Transactions to the wrong address or network
                cannot be recovered.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email for receipt & access
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 rounded-xl border border-white/10 bg-white/70 px-4 py-3 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus-ring dark:bg-white/5 dark:text-white"
                  placeholder="you@example.com"
                />
              </label>

              <label className="flex flex-col text-sm font-semibold text-slate-700 dark:text-slate-200">
                Paste transaction hash
                <input
                  id="txHash"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="0x..."
                  className="mt-2 rounded-xl border border-white/10 bg-white/70 px-4 py-3 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus-ring dark:bg-white/5 dark:text-white"
                />
              </label>
            </div>

            <div className="mt-6 space-y-2 rounded-2xl border border-amber-400/50 bg-amber-500/10 p-4 text-sm text-slate-800 dark:text-slate-100">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded"
                  checked={ackOne}
                  onChange={(e) => setAckOne(e.target.checked)}
                />
                <span>I am sending the correct token on the exact network selected above.</span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded"
                  checked={ackTwo}
                  onChange={(e) => setAckTwo(e.target.checked)}
                />
                <span>I understand crypto payments are final and wrong transfers cannot be reversed.</span>
              </label>
            </div>

            {message && <p className="mt-3 text-sm text-red-500">{message}</p>}

            <button
              type="button"
              disabled={!ackOne || !ackTwo || !txHash || !email}
              onClick={handleConfirm}
              className={[
                "mt-6 w-full rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow hover:shadow-glow focus-ring",
                !ackOne || !ackTwo || !txHash || !email ? "opacity-70 cursor-not-allowed" : "",
              ].join(" ")}
            >
              I have paid
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
