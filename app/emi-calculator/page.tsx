import type { Metadata } from 'next';
import SimpleLoanCalculator from '@/components/SimpleLoanCalculator';

export const metadata: Metadata = {
  title: 'EMI Calculator — Universal Loan EMI Calculator',
  description: 'Universal EMI calculator for any loan type. Enter principal, rate and tenure to get instant EMI and amortization schedule.',
};

export default function EMICalculatorPage() {
  return (
    <SimpleLoanCalculator config={{
      title: 'EMI Calculator',
      subtitle: 'Universal EMI calculator — works for any loan type',
      defaultPrincipal: '1000000',
      defaultRate: '10',
      defaultYears: '10',
      principalLabel: 'Loan Amount',
      emoji: '🧮',
    }} />
  );
}
