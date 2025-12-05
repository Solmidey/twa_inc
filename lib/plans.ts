import { Plan } from '../components/PricingCard';

export const plans: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly Signals',
    price: '$149',
    cadence: 'every month',
    description: 'Great for traders validating the strategy with real-time guidance.',
    features: ['Live signals & execution notes', 'Weekly office hours', 'Risk templates + journaling prompts', 'Access to Discord floor']
  },
  {
    id: 'bimonthly',
    name: 'Bi-monthly Intensive',
    price: '$298',
    cadence: 'every 2 months',
    description: 'Added cadence for traders wanting more time to compound between renewals.',
    features: ['Everything in Monthly', 'Bi-monthly playbook review', 'Priority DM access', 'Micro-coaching on execution']
  },
  {
    id: 'quarterly',
    name: 'Quarterly Intensive',
    price: '$447',
    cadence: 'every 3 months',
    description: 'Best for traders who want a longer commitment with regular feedback loops.',
    features: ['Everything in Bi-monthly', 'Quarterly playbook review', 'First-look on proprietary tools', 'Private mastermind sessions']
  }
];

export const getPlan = (id: string) => plans.find((plan) => plan.id === id);
