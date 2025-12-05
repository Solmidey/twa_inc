import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('theme') as Theme | null) : null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (prefersDark ? 'dark' : 'light');
    setThemeState(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
    setReady(true);
  }, []);

  const setTheme = (value: Theme) => {
    setThemeState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', value);
      document.documentElement.classList.toggle('dark', value === 'dark');
    }
  };

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggle: () => setTheme(theme === 'light' ? 'dark' : 'light'),
    ready
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
