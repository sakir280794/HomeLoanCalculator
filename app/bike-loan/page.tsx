import type { Metadata } from 'next';
import SimpleLoanCalculator from '@/components/SimpleLoanCalculator';

export const metadata: Metadata = {
  title: 'Bike Loan EMI Calculator',
  description: 'Calculate two-wheeler / bike loan EMI, total interest and monthly repayment schedule instantly.',
};

export default function BikeLoanPage() {
  return (
    <SimpleLoanCalculator config={{
      title: 'Bike Loan EMI Calculator',
      subtitle: 'Two-wheeler loan EMI and repayment planner',
      defaultPrincipal: '150000',
      defaultRate: '11',
      defaultYears: '3',
      principalLabel: 'Two-Wheeler Loan Amount',
      emoji: '🏍️',
    }} />
  );
}
