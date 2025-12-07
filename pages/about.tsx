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
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">About Me — Settoblack</h1>
            <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-200">
              <p>
                I&apos;m Albert, a trader and an online educator. My journey began in early 2019, and everything changed in 2020 when I encountered ICT — The Inner Circle Trader. Those teachings completely reshaped my perspective and understanding of the financial markets.
              </p>
              <p>
                In my own study, I learned that the only logic these markets understood was probabilities, as market opportunities can unfold in myriad ways without violating their Higher Timeframe Narratives. Recognizing this became the foundation of my philosophy.
              </p>
              <p>
                Using the lens of ICT concepts, I built a system that adapts to the probabilistic nature of these markets under varying conditions to find my edge and consistency.
              </p>
              <p>
                This system blends quantitative analysis via real-time data backed by a statistical edge, with a strong technical thesis. Allowing for the interpretation of the Higher Timeframe Institutional Orderflow (the long-term bias of the markets, or the Draw on Liquidity), validating feedback, and confirming signals for the integrity of higher timeframe with precision and consistency.
              </p>
              <p>
                Today, I teach and share these ideas publicly so that traders can build clarity, structure, and confidence in their own decision-making.
              </p>
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
