import type { Metadata } from 'next';
import SimpleLoanCalculator from '@/components/SimpleLoanCalculator';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Business Loan EMI Calculator — SME & MSME Loan India',
  description:
    'Calculate business loan EMI, total repayment cost and amortization schedule for SME, MSME and startup loans. Free business loan calculator for any amount and interest rate.',
  keywords: [
    'business loan emi calculator',
    'business loan calculator india',
    'sme loan emi calculator',
    'msme loan calculator',
    'business loan interest calculator',
    'startup loan emi calculator',
    'working capital loan calculator',
  ],
  alternates: { canonical: '/business-loan' },
  openGraph: {
    title: 'Business Loan EMI Calculator — SME & MSME Loan India',
    description: 'Free business loan EMI calculator for SME and MSME loans. Get monthly payment, total cost and full amortization.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Business Loan EMI Calculator',
  url: 'https://home-loan-calculator-ivory.vercel.app/business-loan',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function BusinessLoanPage() {
  return (
    <>
      <JsonLd data={calcSchema} />
      <SimpleLoanCalculator config={{
        title: 'Business Loan EMI Calculator',
        subtitle: 'SME & business loan EMI planner — know your total repayment cost',
        defaultPrincipal: '2000000',
        defaultRate: '13.5',
        defaultYears: '5',
        principalLabel: 'Business Loan Amount',
        emoji: '💼',
      }} />
    </>
  );
}
