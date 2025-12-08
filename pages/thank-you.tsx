import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedReveal from '@/components/ProtectedReveal';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ThankYou() {
  const router = useRouter();
  const { session_id } = router.query;
  const [sessionId, setSessionId] = useState<string | undefined>();

  useEffect(() => {
    if (typeof session_id === 'string') setSessionId(session_id);
  }, [session_id]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-contrast">
      <Head>
        <title>Thank you | TWA Inc.</title>
        <meta name="description" content="Payment received. We are verifying your purchase to unlock Discord access." />
      </Head>
      <Navbar />
      <main id="main" className="section-padding">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/80 p-6 shadow-lg dark:bg-white/5">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Thank you for joining.</h1>
            <p className="mt-2 text-slate-700 dark:text-slate-200">
              We are confirming your payment and will reveal your private Discord invitation below. Keep this page open.
            </p>
          </div>
          <ProtectedReveal />
        </div>
      </main>
      <Footer />
    </div>
  );
}
