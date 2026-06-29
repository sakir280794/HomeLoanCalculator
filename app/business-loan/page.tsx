import type { Metadata } from 'next';
import SimpleLoanCalculator from '@/components/SimpleLoanCalculator';

export const metadata: Metadata = {
  title: 'Business Loan EMI Calculator',
  description: 'Calculate business loan and SME loan EMI, total cost and amortization schedule for any loan amount.',
};

export default function BusinessLoanPage() {
  return (
    <SimpleLoanCalculator config={{
      title: 'Business Loan EMI Calculator',
      subtitle: 'SME & business loan EMI planner — know your total repayment cost',
      defaultPrincipal: '2000000',
      defaultRate: '13.5',
      defaultYears: '5',
      principalLabel: 'Business Loan Amount',
      emoji: '💼',
    }} />
  );
}
