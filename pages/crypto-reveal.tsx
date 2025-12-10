import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CryptoRevealPage() {
  const router = useRouter();
  const { planId, chain, currency, txHash, email } = router.query;
  const [message, setMessage] = useState("Confirming crypto payment...");
  const [invite, setInvite] = useState<string | null>(null);

  useEffect(() => {
    const planIdParam = Array.isArray(planId) ? planId[0] : planId;
    const chainParam = Array.isArray(chain) ? chain[0] : chain;
    const currencyParam = Array.isArray(currency) ? currency[0] : currency;
    const txHashParam = Array.isArray(txHash) ? txHash[0] : txHash;
    const emailParam = Array.isArray(email) ? email[0] : email;

    if (!planIdParam || !chainParam || !currencyParam || !txHashParam || !emailParam) return;

    const runVerify = async () => {
      try {
        const res = await fetch("/api/crypto/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: planIdParam,
            chain: chainParam,
            currency: currencyParam,
            txHash: txHashParam,
            email: emailParam,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data?.ok) {
          setMessage(data?.error || "Unable to confirm payment.");
          return;
        }

        setInvite(data.inviteUrl || null);
        setMessage("Payment confirmed. Welcome in!");
      } catch (e: any) {
        setMessage("Verification failed. Please try again.");
      }
    };

    runVerify();
  }, [planId, chain, currency, txHash, email]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-contrast">
      <Head>
        <title>Discord Access | TWA Inc.</title>
      </Head>
      <Navbar />

      <main id="main" className="section-padding">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-white/10 bg-white/70 p-8 shadow-lg dark:bg-white/5">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Secure Discord access
            </h1>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              {message}
            </p>

            {invite && (
              <a
                href={invite}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow hover:shadow-glow focus-ring"
              >
                Join the private Discord
              </a>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
