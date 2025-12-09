import Head from "next/head";
import ProtectedReveal from "@/components/ProtectedReveal";

export default function RevealPage() {
  return (
    <>
      <Head>
        <title>Reveal access | TWA</title>
      </Head>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Reveal your Discord access
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          After Paystack checkout, you should be redirected here with a transaction reference.
          We’ll verify it automatically and show your invite.
        </p>

        <div className="mt-8">
          <ProtectedReveal />
        </div>
      </main>
    </>
  );
}
