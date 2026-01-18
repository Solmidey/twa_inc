import Head from "next/head";
import { useMemo, useState } from "react";
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
  const [txHash, setTxHash] = useState("");
  const [message, setMessage] = useState("");
  const [ackOne, setAckOne] = useState(false);
  const [ackTwo, setAckTwo] = useState(false);

  const receiver = process.env.NEXT_PUBLIC_CRYPTO_EVM_ADDRESS;
  const usd = getPlanUsd(plan.id);

  const handleConfirm = () => {
    if (!email || !txHash || !ackOne || !ackTwo) {
      setMessage("Please complete all confirmations before continuing.");
      return;
    }

    router.push(
      `/crypto-reveal?planId=${encodeURIComponent(plan.id)}&txHash=${encodeURIComponent(
        txHash
      )}&email=${encodeURIComponent(email)}`
    );
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-contrast">
      <Head>
        <title>Crypto Checkout | TWA Inc.</title>
        <meta name="description" content="Pay with crypto to unlock Discord access." />
      </Head>

      <Navbar />

      <main className="section-padding">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-white/10 bg-white/70 p-8 dark:bg-white/5">

            <h1 className="text-3xl font-bold">
              Subscribe with Crypto
            </h1>

            <div className="mt-4 rounded-xl border border-red-600 bg-red-600/10 p-4 text-sm font-semibold text-red-300">
              ⚠️ Send <strong>ONLY USDT on Arbitrum</strong>.  
              Any other token or network will result in permanent loss of funds.
            </div>

            <p className="mt-4">
              Plan: <strong>{plan.name}</strong>
            </p>

            <p className="mt-1">
              Send exactly <strong>{usd} USDT</strong> on <strong>Arbitrum</strong>
            </p>

            <div className="mt-6 rounded-xl bg-black/20 p-4 text-sm break-all">
              {receiver || "Set NEXT_PUBLIC_CRYPTO_EVM_ADDRESS"}
            </div>

            <div className="mt-6 grid gap-4">
              <input
                type="email"
                placeholder="Email for receipt"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl px-4 py-3"
              />

              <input
                placeholder="Transaction hash (0x...)"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="rounded-xl px-4 py-3"
              />
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <label className="flex gap-2">
                <input type="checkbox" checked={ackOne} onChange={e => setAckOne(e.target.checked)} />
                I confirm this is USDT on Arbitrum
              </label>
              <label className="flex gap-2">
                <input type="checkbox" checked={ackTwo} onChange={e => setAckTwo(e.target.checked)} />
                I understand crypto payments are irreversible
              </label>
            </div>

            {message && <p className="mt-3 text-red-500">{message}</p>}

            <button
              onClick={handleConfirm}
              disabled={!ackOne || !ackTwo}
              className="mt-6 w-full rounded-full bg-brand-primary py-3 font-semibold text-white disabled:opacity-50"
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
