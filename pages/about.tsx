import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-contrast">
      <Head>
        <title>About | TWA Inc.</title>
        <meta name="description" content="Learn about the trader behind TWA Inc. mentorship and signals." />
        <meta property="og:title" content="About | TWA Inc." />
        <meta property="og:description" content="Experience, credentials, and philosophy behind the mentorship." />
      </Head>
      <Navbar />
      <main id="main" className="section-padding">
        <div className="mx-auto grid max-w-5xl items-start gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">About</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Trader, mentor, and execution partner.</h1>
            <p className="mt-4 text-slate-700 dark:text-slate-200">
              I blend discretionary price action with data-backed playbooks honed on futures, FX, and equities. From prop desk roots to running a private floor, I mentor traders on disciplined risk, probabilistic thinking, and crafting a process that survives volatility.
            </p>
            <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/80 p-6 shadow dark:bg-white/5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Credentials & timeline</h2>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>• Former prop trader specializing in breakout/VWAP structures.</li>
                <li>• CMT-level technical analysis foundations with quantitative overlays.</li>
                <li>• Built trade journal frameworks used by 120+ students.</li>
                <li>• Guest educator for multiple trading communities.</li>
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <span className="rounded-full bg-brand-primary/15 px-4 py-2 text-sm font-semibold text-brand-primary">Risk-first philosophy</span>
              <span className="rounded-full bg-brand-accent/15 px-4 py-2 text-sm font-semibold text-brand-contrast">Execution labs weekly</span>
              <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100">Accountability crew</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-6">
            <div className="mx-auto max-w-[520px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-lg">
              <Image src="/assets/about-portrait.jpg" width={900} height={900} alt="Portrait of the trader" className="h-auto w-full max-h-[520px] object-cover" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/70 p-4 shadow dark:bg-white/5">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Brand partners</p>
              <div className="mt-2 flex items-center gap-4">
                <Image src="/assets/logo-light.jpg" width={120} height={40} alt="TWA Inc. light logo" className="block dark:hidden" />
                <Image src="/assets/logo-dark.jpg" width={120} height={40} alt="TWA Inc. dark logo" className="hidden dark:block" />
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Logos adapt to the theme automatically.</p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
