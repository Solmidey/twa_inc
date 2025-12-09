import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-contrast">
      <Head>
        <title>Privacy Policy | TWA Inc.</title>
        <meta
          name="description"
          content="How TWA Inc. handles personal data across mentorship, community, and payment experiences."
        />
      </Head>
      <Navbar />
      <main id="main" className="section-padding">
        <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-white/10 bg-white/70 p-8 shadow-lg dark:bg-white/5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">Privacy</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
            <p className="text-slate-700 dark:text-slate-200">
              We respect the privacy of traders, students, and visitors. We aim to align with applicable data protection laws,
              including the EU GDPR, UK GDPR and Data Protection Act, California&apos;s CCPA/CPRA, and the Nigeria Data Protection
              Act/NDPR where they apply.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-sm dark:bg-white/5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Data we process</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>• Account basics like name, email, and login information to manage memberships.</li>
                <li>• Billing data handled through our payment processors (e.g., Paystack) for plan purchases.</li>
                <li>• Communications you send us for support, mentorship intake, or community moderation.</li>
                <li>• Usage signals such as page interactions to improve content and platform stability.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-sm dark:bg-white/5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">How we use information</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>• Provide mentorship services, gated community access, and educational materials.</li>
                <li>• Process payments, renew subscriptions, and send relevant account notices.</li>
                <li>• Improve site reliability, security, and user experience through analytics.</li>
                <li>• Meet legal, regulatory, and risk obligations for our business operations.</li>
              </ul>
            </section>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-sm dark:bg-white/5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Legal bases and rights</h2>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                Where data protection laws apply, we rely on bases such as contract performance (providing your plan), legitimate
                interests (platform security and improvements), and consent when required (for certain marketing). Depending on
                your location, you may request access, correction, deletion, restriction, portability, or opt out of certain data
                uses. We respond to valid requests consistent with applicable laws.
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-sm dark:bg-white/5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Data sharing and retention</h2>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                We share personal data with service providers who support payments, analytics, communications, and hosting, under
                obligations to protect your information. We retain data while you maintain an account or as needed for legitimate
                business, legal, and security reasons. We delete or anonymize data when it is no longer required.
              </p>
            </section>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-sm dark:bg-white/5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">International data considerations</h2>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                As a remote-first brand, data may be processed in multiple regions. When transferring personal data across
                borders, we aim to use lawful transfer mechanisms and appropriate safeguards as required by applicable
                jurisdictions.
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-sm dark:bg-white/5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Contact</h2>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                Questions or privacy requests? Reach us at{' '}
                <a href="mailto:info@traderswithattitude.com" className="font-semibold text-brand-primary underline">
                  info@traderswithattitude.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
