import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CryptoRevealPage() {
  const router = useRouter();
  const token = String(router.query.token ?? "");
  const [message, setMessage] = useState("Confirming crypto payment...");
  const [invite, setInvite] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    // For now, we reuse a simple env-based invite string if you have one.
    // This makes the flow truly "light" and avoids extra Discord bot work.
    // If later you want bot-generated single-use invites, we can add that safely.
    const configured =
      (process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ||
        process.env.NEXT_PUBLIC_DISCORD_INVITE ||
        "") as string;

    if (!configured) {
      setMessage("Discord invite is not configured.");
      return;
    }

    // If we reached here, /api/crypto/verify already validated tx and issued token.
    // So we can show the invite.
    setInvite(configured);
    setMessage("Payment confirmed.");
  }, [token]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-contrast">
      <Head>
        <title>Discord Access | TWA Inc.</title>
      </Head>
      <Navbar />

      <main id="main" className="section-padding">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-white/10 bg-white/70 p-8 shadow-lg dark:bg-white/5">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Secure Discord access
            </h1>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              {message}
            </p>

            {invite && (
              <a
                href={invite}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow hover:shadow-glow focus-ring"
              >
                Join the private Discord
              </a>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
