export const DISCORD_PERKS = [
  "Live Market Calls",
  "Session Calls",
  "Weekend Calls",
  "Active Community",
  "Private mentorship",
] as const;

export type Plan = {
  id: string;
  name: string;
  price: string;      // display
  cadence: string;    // display
  description: string;
  months: number;     // used by Paystack logic
  priceUsd: number;   // used by Paystack logic
  features: string[]; // kept for compatibility, but we won't show per-card on Pricing page
};

export const plans: Plan[] = [
  {
    id: "monthly",
    name: "Monthly Membership",
    price: "$50",
    cadence: "1 month access",
    description: "Private Discord access for one month.",
    months: 1,
    priceUsd: 50,
    features: [...DISCORD_PERKS],
  },
  {
    id: "bimonthly",
    name: "Bimonthly Membership",
    price: "$100",
    cadence: "2 months access",
    description: "Private Discord access for two months.",
    months: 2,
    priceUsd: 100,
    features: [...DISCORD_PERKS],
  },
  {
    id: "quarterly",
    name: "Quarterly Membership",
    price: "$150",
    cadence: "3 months access",
    description: "Private Discord access for three months.",
    months: 3,
    priceUsd: 150,
    features: [...DISCORD_PERKS],
  },
  {
    id: "sixmonths",
    name: "Six Month Membership",
    price: "$250",
    cadence: "6 months access",
    description: "Private Discord access for six months. Save $50!",
    months: 6,
    priceUsd: 250,
    features: [...DISCORD_PERKS],
  },
  {
    id: "yearly",
    name: "Yearly Membership",
    price: "$500",
    cadence: "12 months access",
    description: "Private Discord access for one year. Save $100!",
    months: 12,
    priceUsd: 500,
    features: [...DISCORD_PERKS],
  },
];

export function getPlan(planId: string) {
  return plans.find((p) => p.id === planId);
}
