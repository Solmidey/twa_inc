import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-contrast">
      <Head>
        <title>Terms of Service | TWA Inc.</title>
        <meta
          name="description"
          content="Ground rules for using TWA Inc. mentorship, community access, and trading education."
        />
      </Head>
      <Navbar />
      <main id="main" className="section-padding">
        <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-white/10 bg-white/70 p-8 shadow-lg dark:bg-white/5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">Terms</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
            <p className="text-slate-700 dark:text-slate-200">
              By accessing TWA Inc. content, mentorship, or community spaces, you agree to these terms. We keep them brief and
              written for traders.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-sm dark:bg-white/5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Educational use only</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>• All material is for education and mentorship. It is not personalized investment, legal, or tax advice.</li>
                <li>• Markets carry risk. Past performance is not indicative of future results. Trade only what you can afford to lose.</li>
                <li>• You are responsible for your own decisions, broker relationships, and compliance with local regulations.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-sm dark:bg-white/5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Accounts and access</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>• Keep your login details secure and do not share paid content outside your account.</li>
                <li>• Subscription fees are handled by our payment processors; by purchasing you authorize recurring charges per your plan.</li>
                <li>• We may suspend or terminate access for misuse, abusive behavior, or security concerns.</li>
              </ul>
            </section>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-sm dark:bg-white/5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Content and community standards</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>• Respect other traders; no harassment, spam, or market manipulation discussions.</li>
                <li>• Do not misrepresent performance or claim affiliation without approval.</li>
                <li>• We may update curriculum, discord access, or schedules to improve the program.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-sm dark:bg-white/5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Disclaimers and limits</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>• Services are provided “as is.” We do not guarantee uptime, profitability, or specific outcomes.</li>
                <li>• We are not a broker-dealer or investment adviser. Verify any trade ideas with your own research and licensed professionals.</li>
                <li>• To the extent allowed by law, our liability is limited to the fees you paid for the service in the past 12 months.</li>
              </ul>
            </section>
          </div>

          <section className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-sm dark:bg-white/5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Contact</h2>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
              Questions about these terms? Reach us at{' '}
              <a href="mailto:s3tt0black@gmail.com" className="font-semibold text-brand-primary underline">
                s3tt0black@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
