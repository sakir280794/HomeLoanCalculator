import type { Metadata } from 'next';
import SimpleLoanCalculator from '@/components/SimpleLoanCalculator';

export const metadata: Metadata = {
  title: 'Education Loan EMI Calculator',
  description: 'Calculate student / education loan EMI, interest and repayment schedule for India and abroad studies.',
};

export default function EducationLoanPage() {
  return (
    <SimpleLoanCalculator config={{
      title: 'Education Loan EMI Calculator',
      subtitle: 'Plan your student loan repayment — EMI, total interest and amortization',
      defaultPrincipal: '1500000',
      defaultRate: '10.5',
      defaultYears: '10',
      principalLabel: 'Education Loan Amount',
      emoji: '🎓',
    }} />
  );
}
