import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingCard from '@/components/PricingCard';
import { plans, getPlan } from '@/lib/plans';
import React, { useState } from 'react';

export default function Pricing() {
  const [email, setEmail] = useState('');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleCheckout = async (planId: string) => {
    const plan = getPlan(planId);
    if (!plan) return;
    if (!email) {
      setMessage('Please add an email so we can send your receipt and unlock the Discord.');
      return;
    }
    try {
      setLoadingPlan(planId);
      setMessage('');
      const res = await fetch('/api/paystack/initialize-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, email })
      });
      const data = await res.json();
      const paystackUrl = data?.data?.authorization_url ?? data?.authorization_url ?? data?.authorizationUrl ?? data?.url;
      if (!res.ok) {
        setMessage(data.error || 'Unable to start checkout.');
        return;
      }
      if (!paystackUrl) { setMessage(data?.error ?? data?.message ?? "Paystack returned no authorization URL"); return; }
      window.location.href = paystackUrl;
    } catch (error) {
      console.error(error);
      setMessage('Paystack error. Please confirm PAYSTACK_SECRET_KEY is set on Vercel.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-contrast">
      <Head>
        <title>Pricing | TWA Inc.</title>
        <meta name="description" content="Signals-only plans with 1, 2, 3, or 6 month access lengths." />
        <meta property="og:title" content="Pricing | TWA Inc." />
        <meta property="og:description" content="Signals-only plans with secure Paystack checkout and Discord unlocks." />
      </Head>
      <Navbar />
      <main id="main" className="section-padding">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">Plans</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Signals-only plans built for compounding.</h1>
          <p className="mt-4 text-slate-700 dark:text-slate-200">
            Secure Paystack Checkout with server-side Discord unlock after payment verification.
          </p>
          <label className="mt-8 inline-flex max-w-md items-center gap-3 rounded-full border border-white/20 bg-white/70 px-4 py-3 shadow focus-within:ring-2 focus-within:ring-brand-primary dark:bg-white/5" htmlFor="email">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email for receipt & access</span>
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
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan, idx) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              highlight={idx === 1}
              loading={loadingPlan === plan.id}
              onSelect={() => handleCheckout(plan.id)}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
