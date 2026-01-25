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
  tag?: string;       // optional tag like "Save $50"
};

export const plans: Plan[] = [
  {
    id: "monthly",
    name: "Monthly Membership",
    price: "$50",
    cadence: "1 month access",
    description: "1 month",
    months: 1,
    priceUsd: 50,
    features: [...DISCORD_PERKS],
  },
  {
    id: "bimonthly",
    name: "Bimonthly Membership",
    price: "$100",
    cadence: "2 months access",
    description: "2 months",
    months: 2,
    priceUsd: 100,
    features: [...DISCORD_PERKS],
  },
  {
    id: "quarterly",
    name: "Quarterly Membership",
    price: "$150",
    cadence: "3 months access",
    description: "3 months",
    months: 3,
    priceUsd: 150,
    features: [...DISCORD_PERKS],
  },
  {
    id: "sixmonths",
    name: "Six Months Membership",
    price: "$250",
    cadence: "6 months access",
    description: "6 months",
    months: 6,
    priceUsd: 250,
    features: [...DISCORD_PERKS],
    tag: "Save $50",
  },
  {
    id: "yearly",
    name: "Yearly Membership",
    price: "$500",
    cadence: "12 months access",
    description: "12 months",
    months: 12,
    priceUsd: 500,
    features: [...DISCORD_PERKS],
    tag: "Save $100",
  },
];

export function getPlan(planId: string) {
  return plans.find((p) => p.id === planId);
}
