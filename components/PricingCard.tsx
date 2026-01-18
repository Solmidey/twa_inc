import { motion } from "framer-motion";
import clsx from "@/lib/clsx";

export type Plan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  description?: string;
  features?: string[];
};

export default function PricingCard({
  plan,
  onSelect,
  highlight,
  loading,
  cryptoHref,
}: {
  plan: Plan;
  onSelect: (plan: Plan) => void;
  highlight?: boolean;
  loading?: boolean;
  cryptoHref?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      viewport={{ once: true }}
      className={clsx(
        "flex h-full flex-col rounded-3xl border border-white/10 bg-white/80 p-6 shadow-lg dark:bg-white/5",
        highlight && "ring-2 ring-brand-primary shadow-xl"
      )}
    >
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {plan.name}
          </h3>
          {plan.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {plan.description}
            </p>
          )}
        </div>
        {highlight && (
          <span className="rounded-full bg-brand-primary/15 px-3 py-1 text-xs font-semibold text-brand-primary">
            Popular
          </span>
        )}
      </header>

      <div className="mb-6">
        <p className="text-4xl font-bold text-slate-900 dark:text-white">
          {plan.price}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          {plan.cadence}
        </p>
      </div>

      {!!plan.features?.length && (
        <ul className="mb-8 space-y-2 text-sm text-slate-700 dark:text-slate-200">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span
                className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-primary"
                aria-hidden
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => onSelect(plan)}
        disabled={!!loading}
        aria-busy={!!loading}
        className={clsx(
          "mt-auto rounded-full bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow hover:-translate-y-0.5 hover:shadow-lg focus-ring",
          loading && "opacity-70 cursor-not-allowed"
        )}
      >
        {loading ? "Redirecting…" : "Subscribe"}
      </button>

      {cryptoHref && (
        <a
          href={cryptoHref}
          className="
            relative mt-4 inline-flex items-center justify-center
            rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white
            shadow-lg shadow-emerald-500/30
            hover:bg-emerald-500 hover:shadow-emerald-500/50
            focus-ring transition
          "
        >
          <span className="absolute -top-2 right-3 rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Recommended
          </span>
          Subscribe with Crypto
        </a>
      )}
    </motion.article>
  );
}
