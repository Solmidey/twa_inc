import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeContext';

const Navbar: React.FC = () => {
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur border-b border-white/10 bg-brand-bg/80 dark:bg-brand-bg/70">
      <a href="#main" className="skip-link">Skip to content</a>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8" aria-label="Primary">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 focus-ring rounded-md">
            <div className="relative h-10 w-28">
              <Image src="/assets/logo-light.svg" alt="TWA Inc. logo" fill className={`object-contain ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`} priority />
              <Image src="/assets/logo-dark.svg" alt="TWA Inc. logo" fill className={`object-contain transition ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
            </div>
            <span className="sr-only">TWA Inc. home</span>
          </Link>
          <div className="hidden gap-6 text-sm font-medium text-slate-700 dark:text-slate-200 md:flex">
            <Link href="/about" className="hover:text-brand-primary focus-ring rounded-md px-2 py-1">About</Link>
            <Link href="/pricing" className="hover:text-brand-primary focus-ring rounded-md px-2 py-1">Pricing</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="hidden rounded-full border border-brand-primary/60 bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-glow focus-ring md:inline-flex">Join signals</Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
