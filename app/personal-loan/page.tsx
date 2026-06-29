import type { Metadata } from 'next';
import SimpleLoanCalculator from '@/components/SimpleLoanCalculator';

export const metadata: Metadata = {
  title: 'Personal Loan EMI Calculator',
  description: 'Calculate personal loan EMI, total interest, and get a month-by-month amortization schedule instantly.',
};

export default function PersonalLoanPage() {
  return (
    <SimpleLoanCalculator config={{
      title: 'Personal Loan EMI Calculator',
      subtitle: 'Calculate your monthly EMI and total interest for any personal loan',
      defaultPrincipal: '500000',
      defaultRate: '12',
      defaultYears: '5',
      emoji: '👤',
    }} />
  );
}
