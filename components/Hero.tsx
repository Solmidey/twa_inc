import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const stats = [
  { label: 'Win rate', value: '71%' },
  { label: 'Students mentored', value: '120+' },
  { label: 'Avg. monthly ROI', value: '18.3%' }
];

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-brand-bg">
      <div className="absolute inset-0 parallax-bg" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent dark:from-slate-900/60" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-20 md:grid-cols-2 md:px-10">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 shadow dark:bg-white/5 dark:text-slate-200">
              Institutional-grade strategies for retail edge
            </p>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 dark:text-white md:text-5xl">
              Precision trading mentorship & signals built for serious growth.
            </h1>
            <p className="mt-4 text-lg text-slate-700 dark:text-slate-200">
              Learn the exact process used to navigate volatile markets with confidence. Get battle-tested setups, live breakdowns, and a private discord where we execute together.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/pricing" className="rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl focus-ring">
                View plans
              </Link>
              <Link href="/about" className="text-sm font-semibold text-brand-contrast underline-offset-4 hover:underline focus-ring rounded-md px-2 py-1">
                Meet the trader
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/30 bg-white/70 p-4 text-slate-800 shadow dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="relative"
          >
            <div className="gradient-border rounded-3xl bg-brand-surface p-2 shadow-glow">
              <div className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-lg">
                <Image src="/assets/about-portrait.jpg" alt="Professional trader portrait" width={900} height={900} priority className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" aria-hidden />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-white backdrop-blur">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/70">Live trade</p>
                    <p className="font-semibold">Breakout + VWAP</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden />
                    streaming
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-10 -left-6 hidden w-64 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-xl dark:bg-slate-900/80 md:block"
            aria-hidden
          >
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">Equity curve</p>
            <svg viewBox="0 0 200 80" className="mt-2 h-24 w-full text-brand-primary" role="presentation">
              <defs>
                <linearGradient id="curve" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 60 Q40 20 80 40 T160 20 T200 15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M0 60 Q40 20 80 40 T160 20 T200 15 V80 H0 Z" fill="url(#curve)" />
            </svg>
            <p className="text-[11px] text-slate-500 dark:text-slate-300">Decorative equity curve for aesthetic only.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
