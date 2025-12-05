import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => (
  <footer className="border-t border-white/10 bg-brand-bg/80 py-10 text-sm text-slate-600 dark:bg-brand-bg/60 dark:text-slate-300">
    <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-6 md:flex-row md:px-8">
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">TWA Inc.</p>
        <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-300">
          Premium trading mentorship and institutional-grade signal flow with disciplined risk practices and human-first coaching.
        </p>
      </div>
      <div className="flex gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Company</p>
          <Link href="/about" className="block hover:text-brand-primary focus-ring rounded-md px-1 py-0.5">About</Link>
          <Link href="/pricing" className="block hover:text-brand-primary focus-ring rounded-md px-1 py-0.5">Pricing</Link>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Legal</p>
          <Link href="/terms" className="block hover:text-brand-primary focus-ring rounded-md px-1 py-0.5">
            Terms
          </Link>
          <Link href="/privacy" className="block hover:text-brand-primary focus-ring rounded-md px-1 py-0.5">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
