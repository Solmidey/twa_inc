import { Plan } from '../components/PricingCard';

export const plans: Plan[] = [
  {
    id: 'starter-monthly',
    name: 'Monthly Signals',
    price: '$149',
    cadence: 'per month',
    description: 'Great for traders validating the strategy with real-time guidance.',
    features: ['Live signals & execution notes', 'Weekly office hours', 'Risk templates + journaling prompts', 'Access to Discord floor']
  },
  {
    id: 'intensive-quarterly',
    name: 'Quarterly Intensive',
    price: '$399',
    cadence: 'every 3 months',
    description: 'Deeper mentorship with quarterly reviews and tighter feedback loops.',
    features: ['Everything in Monthly', 'Quarterly playbook review', 'Priority DM access', 'Micro-coaching on execution']
  },
  {
    id: 'founders-yearly',
    name: 'Founders Yearly',
    price: '$1299',
    cadence: 'per year',
    description: 'Full-year access with VIP strategy drops and seat-limited trading floor.',
    features: ['Everything in Intensive', 'VIP trade camp seats', 'First-look on proprietary tools', 'Private mastermind sessions']
  }
];

export const getPlan = (id: string) => plans.find((plan) => plan.id === id);
