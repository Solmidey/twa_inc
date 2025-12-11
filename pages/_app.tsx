import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/ThemeContext';
import ChristmasSnow from '@/components/ChristmasSnow';

export default function App({ Component, pageProps }: AppProps) {
  const [isChristmasSeason, setIsChristmasSeason] = useState(false);

  useEffect(() => {
    const today = new Date();
    const season = today.getMonth() === 11 && today.getDate() <= 26;
    setIsChristmasSeason(season);
  }, []);

  return (
    <ThemeProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {isChristmasSeason && <ChristmasSnow />}
      <div className="relative z-10">
        <Component {...pageProps} />
        <Analytics />
      </div>
    </ThemeProvider>
  );
}
