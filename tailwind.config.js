/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css,scss}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          accent: 'var(--brand-accent)',
          bg: 'var(--brand-bg)',
          surface: 'var(--brand-surface)',
          contrast: 'var(--brand-contrast)'
        }
      },
      boxShadow: {
        glow: '0 10px 40px rgba(0,0,0,0.12)'
      }
    }
  },
  plugins: []
};
