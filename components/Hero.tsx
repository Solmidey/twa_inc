import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const highlights = [
  'Structured price action mentorship',
  'Risk-first approach and journal reviews',
  'Live breakdowns of trades and weekly markups'
];

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-brand-bg">
      <div className="absolute inset-0 parallax-bg" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent dark:from-slate-900/60" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-20 md:grid-cols-2 md:px-10">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" aria-hidden />
              TWA Inc.
            </div>
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
            <div className="mt-10 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/30 bg-white/70 p-4 text-slate-800 shadow dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                >
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary">
                    •
                  </span>
                  <p className="text-sm font-semibold leading-relaxed">{item}</p>
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
                </div>
              </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
