import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingCard from '@/components/PricingCard';
import { plans, getPlan, DISCORD_PERKS } from '@/lib/plans';
import React, { useState } from 'react';

export default function Pricing() {
  const [email, setEmail] = useState('');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleCheckoutDisabled = () => {
    setMessage("Paystack payments are currently disabled. Please use Crypto payment instead.");
  };


  return (
    <div className="min-h-screen bg-brand-bg text-brand-contrast">
      <Head>
        <title>Pricing | TWA Inc.</title>
        <meta
          name="description"
          content="Subscribe to gain access to our private Discord with disciplined market guidance and community support."
        />
        <meta property="og:title" content="Pricing | TWA Inc." />
        <meta
          property="og:description"
          content="Secure Paystack checkout with verified access to the private Discord."
        />
      </Head>

      <Navbar />

      <main id="main" className="section-padding">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">Plans</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Subscribe to gain access to the Private Discord.
          </h1>
          <p className="mt-4 text-slate-700 dark:text-slate-200">
            Secure Paystack Checkout with server-side Discord unlock after payment verification.
          </p>

          <p className="mt-8 text-sm text-slate-700 dark:text-slate-200">
            Before you subscribe, please enter the email you want to use for your Paystack receipt.
          </p>

          <label
            className="mt-3 inline-flex max-w-md items-center gap-3 rounded-full border border-white/20 bg-white/70 px-4 py-3 shadow focus-within:ring-2 focus-within:ring-brand-primary dark:bg-white/5"
            htmlFor="email"
          >
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Email for your Paystack receipt
            </span>
            <input
              id="email"
              type="email"
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {message && <p className="mt-3 text-sm text-red-500">{message}</p>}
<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Paystack payments are currently disabled. Please use Crypto payment instead.</p>

          <div className="mt-10 mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/70 p-6 text-left shadow-lg dark:bg-white/5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              What you get inside the Discord
            </h2>
            <ul className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
              {DISCORD_PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-primary" aria-hidden="true" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {plans.map((plan, idx) => (
              <PricingCard
                key={plan.id}
                plan={{ ...plan, features: [] }}
                highlight={idx === 1}
                loading={loadingPlan === plan.id}
                onSelect={() => setMessage("Paystack payments are currently disabled. Please use Crypto payment instead.")}
                cryptoHref={`/crypto-checkout?planId=${plan.id}${
                  email ? `&email=${encodeURIComponent(email)}` : ""
                }`}
              />
            ))}
          </div>
      </main>

      <Footer />
    </div>
  );
}
