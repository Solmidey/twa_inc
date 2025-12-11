import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/ThemeContext';
import ChristmasSnow from '@/components/ChristmasSnow';

export default function App({ Component, pageProps }: AppProps) {
  const today = new Date();
  const isChristmasSeason =
    today.getMonth() === 11 && // December (0-based index)
    today.getDate() <= 26;

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
