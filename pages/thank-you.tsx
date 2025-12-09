import Head from "next/head";
import Link from "next/link";
import ProtectedReveal from "@/components/ProtectedReveal";
import Footer from "@/components/Footer";

export default function ThankYou() {
  return (
    <>
      <Head>
        <title>Thank you | TWA Inc.</title>
      </Head>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/pricing" className="text-sm text-slate-400 hover:text-white">
          ← Back to pricing
        </Link>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-10">
          <h1 className="text-3xl font-bold text-white">Payment received</h1>
          <p className="mt-2 text-slate-200">
            If your Paystack payment was successful, your Discord access will unlock below.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-10">
          <h2 className="text-lg font-semibold text-white">Secure Discord access</h2>
          <p className="mt-2 text-slate-200">
            We verify your Paystack payment automatically. Once confirmed, your invite link is generated server-side
            and shown here for a short time.
          </p>

          <ProtectedReveal />
        </div>
      </main>

      <Footer />
    </>
  );
}
