import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-contrast">
      <Head>
        <title>TWA Inc. | Precision Trading Mentorship & Discord access</title>
        <meta
          name="description"
          content="Professional trader providing private mentorship and private Discord access."
        />
        <meta property="og:title" content="TWA Inc. | Precision Trading Mentorship" />
        <meta property="og:description" content="Join a private trading floor with disciplined strategy and real-time discord access." />
      </Head>
      <Navbar />
      <main id="main">
        <Hero />
        <section className="section-padding bg-brand-bg">
          <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/70 p-10 shadow-lg dark:bg-white/5">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Learn With TWA on YouTube</h2>
                <p className="text-base text-slate-700 dark:text-slate-200">
                  For education, trade breakdowns, and weekly market insights, make sure to follow our YouTube channel.
                </p>
              </div>
              <div className="flex items-center">
                <a
                  href="https://www.youtube.com/@settoblack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl focus-ring"
                >
                  Visit the YouTube channel
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="section-padding bg-brand-bg">
          <div className="mx-auto flex max-w-5xl flex-col gap-10">
            <div className="grid gap-6 md:grid-cols-3">
              {["Market structure deconstructed", "Risk is the first input", "Accountability that compounds"].map((title) => (
                <motion.div key={title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-white/10 bg-white/70 p-5 shadow dark:bg-white/5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Expect transparent playbooks, pre-market plans, and a floor that keeps you honest to the system.
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 p-8 shadow-xl">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Access The Private Discord</h3>
                </div>
                <Link href="/pricing" className="rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow focus-ring">
                  Subscribe
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
