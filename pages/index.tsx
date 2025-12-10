import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode, SVGProps } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/components/ThemeContext';

type SocialButtonProps = {
  href: string;
  label: string;
  icon: ReactNode;
  className?: string;
  ariaLabel?: string;
};

const SocialButton = ({ href, label, icon, className, ariaLabel }: SocialButtonProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel ?? label}
    className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow transition hover:-translate-y-0.5 hover:shadow-lg focus-ring ${className}`}
  >
    {icon}
    <span>{label}</span>
  </a>
);

const XIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="m18 6-10 12" />
    <path d="m6 6 10 12" />
  </svg>
);

const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <defs>
      <linearGradient id="igGradient" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#F58529" />
        <stop offset="0.5" stopColor="#DD2A7B" />
        <stop offset="1" stopColor="#8134AF" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="18" rx="5" ry="5" stroke="url(#igGradient)" strokeWidth="2" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#igGradient)" strokeWidth="2" />
    <path d="M17.5 6.5h.01" stroke="url(#igGradient)" strokeWidth="2" />
  </svg>
);

const YoutubeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M21.83 7.5a2.76 2.76 0 0 0-1.94-1.95C18.1 5 12 5 12 5s-6.11 0-7.89.55A2.76 2.76 0 0 0 2.17 7.5 29.6 29.6 0 0 0 1.67 12a29.6 29.6 0 0 0 .5 4.5 2.76 2.76 0 0 0 1.94 1.95C5.9 19 12 19 12 19s6.11 0 7.89-.55a2.76 2.76 0 0 0 1.94-1.95 29.6 29.6 0 0 0 .5-4.5 29.6 29.6 0 0 0-.5-4.5Z"
      fill="#FF0000"
    />
    <path d="m10 15 5.19-3L10 9v6Z" fill="white" />
  </svg>
);

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
        <section className="relative overflow-hidden py-20 sm:py-24">
          <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 text-center md:px-10">
            <h1 className="text-4xl font-bold leading-tight text-slate-900 dark:text-white md:text-5xl">Welcome, to TWA Inc.</h1>
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
                className="rounded-full border border-brand-primary/60 bg-white/80 px-6 py-3 text-sm font-semibold text-brand-contrast shadow hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-primary focus-ring dark:bg-white/5"
              >
                View plans
              </Link>
            </div>
          </div>
        </section>

        <section className="section-padding bg-brand-bg">
          <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-white/10 bg-white/70 p-8 shadow-xl dark:bg-white/5">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Socials</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow dark:bg-white/5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Follow Settoblack on Social Media</h3>
                <div className="mt-4 flex flex-col gap-3">
                  <SocialButton
                    href="https://x.com/settoblack"
                    label="X"
                    ariaLabel="Visit Settoblack on X"
                    icon={<XIcon className="h-4 w-4" />}
                    className="border border-black/20 bg-white text-black hover:border-black/40 dark:bg-white/10 dark:text-white"
                  />
                  <SocialButton
                    href="https://www.instagram.com/settoblack"
                    label="Instagram"
                    ariaLabel="Visit Settoblack on Instagram"
                    icon={<InstagramIcon className="h-4 w-4" />}
                    className="border border-white/30 bg-white/90 text-slate-900 hover:border-white/50 dark:bg-white/10 dark:text-white"
                  />
                  <SocialButton
                    href="https://www.youtube.com/@settoblack"
                    label="YouTube"
                    ariaLabel="Visit Settoblack on YouTube"
                    icon={<YoutubeIcon className="h-4 w-4" />}
                    className="border border-red-500/40 bg-white text-slate-900 hover:border-red-500/60 dark:bg-white/10 dark:text-white"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow dark:bg-white/5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Follow TWA Inc on Social Media</h3>
                <div className="mt-4 flex flex-col gap-3">
                  <SocialButton
                    href="https://x.com/TWAInc_"
                    label="X"
                    ariaLabel="Visit TWA Inc on X"
                    icon={<XIcon className="h-4 w-4" />}
                    className="border border-black/20 bg-white text-black hover:border-black/40 dark:bg-white/10 dark:text-white"
                  />
                  <SocialButton
                    href="https://www.instagram.com/twainc_"
                    label="Instagram"
                    ariaLabel="Visit TWA Inc on Instagram"
                    icon={<InstagramIcon className="h-4 w-4" />}
                    className="border border-white/30 bg-white/90 text-slate-900 hover:border-white/50 dark:bg-white/10 dark:text-white"
                  />
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
