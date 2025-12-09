import Head from "next/head";
import ProtectedReveal from "@/components/ProtectedReveal";

export default function ThankYouPage() {
  return (
    <>
      <Head>
        <title>Thank you | TWA</title>
      </Head>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Payment received
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          If your Paystack payment was successful, your Discord access will unlock below.
        </p>

        <div className="mt-8">
          <ProtectedReveal />
        </div>
      </main>
    </>
  );
}
