# TWA Inc. - Trading Mentorship & Signals


## Quick start
1. Install dependencies: `npm install` (Node 18+).  
2. Copy `.env.local` and set the environment variables below.  
3. Run locally: `npm run dev` (http://localhost:3000).  

## Environment variables
```
# JWT signing
JWT_SECRET=super-secret-jwt-key
# App domain for redirects (no trailing slash)
DOMAIN=https://your-site.vercel.app
```

- `/api/reveal?session_id=...` (GET) verifies the paid session server-side, mints a new 15-minute token, and stores it.  
- `/api/reveal` (POST) expects `{ token }`; it validates the JWT and stored expiry, then returns the Discord invite URL.  
- The `ProtectedReveal` component runs this two-step flow so the invite never appears in client code until the server confirms payment.

`data/purchases.json` is a demo-only, file-based store. Swap with a database (Supabase/Postgres/Planetscale/etc.) for production.

## Pages & routes
- `/` – Hero, value prop, trust cues, animated visuals.
- `/about` – Biography, credentials, and theme-aware logos.
- `/thank-you` – Post-checkout page that reveals Discord access after verification.
- `/reveal` – Utility page to unlock access again by pasting the session id.

## Theming & branding
- Theme toggle writes preference to `localStorage` and toggles the `dark` class on `<html>`.  
- Brand tokens live in `styles/globals.css` as CSS variables: `--brand-primary`, `--brand-accent`, `--brand-bg`, `--brand-surface`, `--brand-contrast`.  
- Update these variables to match your incorporation logos; Tailwind references them via `brand.primary`, `brand.accent`, etc.  
- Light logo: `public/assets/logo-light.svg` shows on light mode; dark logo: `public/assets/logo-dark.svg` shows when `.dark` is present.

Example token swap:
```css
:root {
  --brand-primary: #0ea5e9; /* sample pulled from logo accent */
  --brand-accent: #22d3ee;
  --brand-bg: #f8fafc;
  --brand-surface: #ffffff;
  --brand-contrast: #0f172a;
}
.dark {
  --brand-primary: #67e8f9;
  --brand-accent: #38bdf8;
  --brand-bg: #0b1224;
  --brand-surface: #0f172a;
  --brand-contrast: #e2e8f0;
}
```
Drop your provided logos in `public/assets/` with the same filenames to keep theme-aware switching.

## Accessibility & SEO
- Semantic HTML, focus-visible outlines, skip link, and color-contrast-aware palettes.
- Open Graph tags per page; uses Next.js Head.
- Keyboard reachable toggles and buttons.

## Deployment (Vercel)
- Add env vars in the Vercel dashboard to match `.env.local`.  
- `npm run vercel-build` is available for Vercel’s build step (identical to `next build`).  

1. Start dev server: `npm run dev`.  
3. Use Checkout test cards (e.g., `4242 4242 4242 4242`).  
4. After payment, the `/thank-you` page will poll `/api/reveal` and unlock the Discord invite once the webhook fires.

## Assets
- `public/assets/logo-light.svg` / `logo-dark.svg` – theme-aware logos (replace with supplied artwork).
- `public/assets/about-portrait.svg` – placeholder for the “About me” image; replace with your provided portrait.

## Notes
- No secrets are stored client-side. The Discord invite is returned only after server verification.  
- Animations use `framer-motion`; parallax/gradient backgrounds are CSS-driven for performance.  
- Uses `@vercel/analytics` for lightweight analytics; remove if not needed.


## Payments (Paystack)
- This project uses Paystack for subscriptions and Discord access.
- Set env vars:
  - PAYSTACK_SECRET_KEY=...
  - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=...
- Pricing buttons call your Paystack initialization route.
