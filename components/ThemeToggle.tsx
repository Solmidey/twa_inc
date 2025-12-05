import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { useTheme } from './ThemeContext';
import clsx from 'clsx';

export const ThemeToggle: React.FC = () => {
  const { theme, toggle, ready } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      className={clsx('inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium focus-ring transition',
        'bg-brand-surface/80 shadow hover:shadow-glow border border-white/10 dark:border-white/5')}
      aria-pressed={isDark}
      aria-label="Toggle theme"
      disabled={!ready}
    >
      {isDark ? <MoonIcon className="h-4 w-4" aria-hidden /> : <SunIcon className="h-4 w-4" aria-hidden />}
      <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'} mode</span>
    </button>
  );
};

export default ThemeToggle;
