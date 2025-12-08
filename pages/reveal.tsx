import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedReveal from '@/components/ProtectedReveal';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Reveal() {
  const router = useRouter();
  const { session_id } = router.query;
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    if (typeof session_id === 'string') setSessionId(session_id);
  }, [session_id]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-contrast">
      <Head>
        <title>Reveal access | TWA Inc.</title>
        <meta name="description" content="Verify your purchase to reveal the Discord invitation." />
      </Head>
      <Navbar />
      <main id="main" className="section-padding">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/80 p-6 shadow-lg dark:bg-white/5">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Secure reveal</h1>
            <p className="mt-2 text-slate-700 dark:text-slate-200">
              Paste your Stripe checkout session ID if you need to unlock access again. The server will verify payment before revealing the Discord invite.
            </p>
            <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="sessionId">
              Session ID
            </label>
            <input
              id="sessionId"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="cs_test_..."
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-white/10 dark:text-white"
            />
          </div>
          <ProtectedReveal />
        </div>
      </main>
      <Footer />
    </div>
  );
}
