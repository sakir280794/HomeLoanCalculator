import type { Metadata } from 'next';
import SimpleLoanCalculator from '@/components/SimpleLoanCalculator';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Personal Loan EMI Calculator — Monthly EMI & Interest',
  description:
    'Calculate personal loan EMI, total interest payable and get a full month-by-month amortization schedule. Free personal loan calculator for any amount, rate and tenure.',
  keywords: [
    'personal loan emi calculator',
    'personal loan calculator india',
    'personal loan interest calculator',
    'personal loan monthly emi',
    'personal loan calculator 2026',
    'unsecured loan emi calculator',
    'personal loan amortization calculator',
  ],
  alternates: { canonical: '/personal-loan' },
  openGraph: {
    title: 'Personal Loan EMI Calculator — Monthly EMI & Interest',
    description: 'Free personal loan EMI calculator. Get monthly EMI, total interest and amortization schedule instantly.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Personal Loan EMI Calculator',
  url: 'https://home-loan-calculator-ivory.vercel.app/personal-loan',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function PersonalLoanPage() {
  return (
    <>
      <JsonLd data={calcSchema} />
      <SimpleLoanCalculator config={{
        title: 'Personal Loan EMI Calculator',
        subtitle: 'Calculate your monthly EMI and total interest for any personal loan',
        defaultPrincipal: '500000',
        defaultRate: '12',
        defaultYears: '5',
        emoji: '👤',
      }} />
    </>
  );
}
