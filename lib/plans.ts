import { Plan } from '../components/PricingCard';

export const plans: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly Signals (1 month)',
    price: '$149',
    cadence: '1 month access',
    description: 'Signals-only access with a monthly renewal cadence.',
    features: [
      'Access to TWA trade signals',
      'Private Discord signals channel',
      'Real-time updates during active market setups',
      'Plan duration: 1 month'
    ]
  },
  {
    id: 'bimonthly',
    name: 'Bi-monthly Signals (2 months)',
    price: '$298',
    cadence: '2 months access',
    description: 'Signals-only access with a bi-monthly renewal cadence.',
    features: [
      'Access to TWA trade signals',
      'Private Discord signals channel',
      'Real-time updates during active market setups',
      'Plan duration: 2 months'
    ]
  },
  {
    id: 'quarterly',
    name: 'Quarterly Signals (3 months)',
    price: '$447',
    cadence: '3 months access',
    description: 'Signals-only access with a quarterly renewal cadence.',
    features: [
      'Access to TWA trade signals',
      'Private Discord signals channel',
      'Real-time updates during active market setups',
      'Plan duration: 3 months'
    ]
  }
];

export const getPlan = (id: string) => plans.find((plan) => plan.id === id);
