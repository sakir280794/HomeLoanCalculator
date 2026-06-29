import type { Metadata } from 'next';
import SimpleLoanCalculator from '@/components/SimpleLoanCalculator';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Education Loan EMI Calculator — Student Loan Repayment India',
  description:
    'Calculate education loan EMI, total interest and repayment schedule for India and abroad studies. Free student loan calculator for any amount, rate and tenure with moratorium period.',
  keywords: [
    'education loan emi calculator',
    'education loan calculator india',
    'student loan emi calculator',
    'education loan repayment calculator',
    'study loan calculator',
    'education loan interest calculator',
    'education loan for abroad calculator',
  ],
  alternates: { canonical: '/education-loan' },
  openGraph: {
    title: 'Education Loan EMI Calculator — Student Loan Repayment India',
    description: 'Free education loan EMI calculator. Plan student loan repayment with full amortization schedule.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Education Loan EMI Calculator',
  url: 'https://home-loan-calculator-ivory.vercel.app/education-loan',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function EducationLoanPage() {
  return (
    <>
      <JsonLd data={calcSchema} />
      <SimpleLoanCalculator config={{
        title: 'Education Loan EMI Calculator',
        subtitle: 'Plan your student loan repayment — EMI, total interest and amortization',
        defaultPrincipal: '1500000',
        defaultRate: '10.5',
        defaultYears: '10',
        principalLabel: 'Education Loan Amount',
        emoji: '🎓',
      }} />
    </>
  );
}
