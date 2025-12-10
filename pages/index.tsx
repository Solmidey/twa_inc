import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/components/ThemeContext';

export default function Home() {
  const { theme } = useTheme();

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
      <main id="main" className="bg-brand-bg">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 parallax-bg" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent dark:from-slate-900/60" aria-hidden />
          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 pb-16 pt-20 text-center md:px-10">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight text-slate-900 dark:text-white md:text-5xl">
                Welcome, to TWA Inc.
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-slate-700 dark:text-slate-200">
                Precision trading mentorship and a private Discord built for disciplined execution.
              </p>
            </div>
            <div className="relative w-full max-w-3xl rounded-3xl border border-white/20 bg-white/70 p-6 shadow-glow dark:bg-white/5">
              <div className="relative mx-auto h-32 w-full max-w-md">
                <Image
                  src="/assets/logo-light.jpg"
                  alt="TWA Inc. logo"
                  fill
                  className={`object-contain transition-opacity duration-300 ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`}
                  priority
                />
                <Image
                  src="/assets/logo-dark.jpg"
                  alt="TWA Inc. logo"
                  fill
                  className={`object-contain transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/about"
                className="rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl focus-ring"
              >
                Meet the trader
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-brand-primary/60 px-6 py-3 text-sm font-semibold text-brand-contrast shadow hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-primary focus-ring bg-white/80 dark:bg-white/5"
              >
                View plans
              </Link>
            </div>
          </div>
        </section>

        <section className="section-padding bg-brand-bg">
          <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-white/10 bg-white/60 p-8 shadow-xl dark:bg-white/5">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Socials</h2>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">Stay connected with the latest updates.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow dark:bg-white/5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Settoblack’s Socials</h3>
                <div className="mt-4 flex flex-col gap-3">
                  <a
                    href="https://x.com/settoblack"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow hover:-translate-y-0.5 hover:shadow-lg focus-ring"
                  >
                    X
                  </a>
                  <a
                    href="https://www.instagram.com/settoblack"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:-translate-y-0.5 hover:shadow-lg focus-ring dark:bg-white/10 dark:text-white"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.youtube.com/@settoblack"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:-translate-y-0.5 hover:shadow-lg focus-ring dark:bg-white/10 dark:text-white"
                  >
                    YouTube
                  </a>
                </div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow dark:bg-white/5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">TWA Inc’s Socials</h3>
                <div className="mt-4 flex flex-col gap-3">
                  <a
                    href="https://x.com/TWAInc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow hover:-translate-y-0.5 hover:shadow-lg focus-ring"
                  >
                    X
                  </a>
                  <a
                    href="https://www.instagram.com/twainc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:-translate-y-0.5 hover:shadow-lg focus-ring dark:bg-white/10 dark:text-white"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
