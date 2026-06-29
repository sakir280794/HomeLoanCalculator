import type { Metadata } from 'next';
import SimpleLoanCalculator from '@/components/SimpleLoanCalculator';

export const metadata: Metadata = {
  title: 'Car Loan EMI Calculator',
  description: 'Calculate car loan EMI, total cost of ownership and amortization schedule for any vehicle loan.',
};

export default function CarLoanPage() {
  return (
    <SimpleLoanCalculator config={{
      title: 'Car Loan EMI Calculator',
      subtitle: 'Plan your car purchase — EMI, total interest and repayment schedule',
      defaultPrincipal: '800000',
      defaultRate: '9.5',
      defaultYears: '7',
      principalLabel: 'Car Loan Amount',
      emoji: '🚗',
    }} />
  );
}
