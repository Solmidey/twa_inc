import { Plan } from '../components/PricingCard';

const sharedPerks = [
  'Live Market Calls',
  'Season Calls',
  'Weekend Calls',
  'Active Community',
  'Private mentorship'
];

export const plans: Plan[] = [
  {
    id: 'monthly',
    name: '1 Month',
    price: '$50',
    cadence: '1 month access',
    description: 'Signals and community access for one month.',
    features: sharedPerks
  },
  {
    id: 'bimonthly',
    name: '2 Months',
    price: '$100',
    cadence: '2 months access',
    description: 'Signals and community access for two months.',
    features: sharedPerks
  },
  {
    id: 'quarterly',
    name: '3 Months',
    price: '$150',
    cadence: '3 months access',
    description: 'Signals and community access for three months.',
    features: sharedPerks
  },
  {
    id: 'semiannual',
    name: '6 Months',
    price: '$300',
    cadence: '6 months access',
    description: 'Signals and community access for six months.',
    features: sharedPerks
  }
];

export const getPlan = (id: string) => plans.find((plan) => plan.id === id);
