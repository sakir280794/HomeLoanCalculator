import type { Metadata } from 'next';
import SimpleLoanCalculator from '@/components/SimpleLoanCalculator';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Car Loan EMI Calculator — Vehicle Loan Monthly Payment India',
  description:
    'Calculate car loan EMI, total cost of ownership and amortization schedule for any vehicle loan. Free car loan calculator for India — new and used vehicles, any loan amount.',
  keywords: [
    'car loan emi calculator',
    'car loan calculator india',
    'vehicle loan emi calculator',
    'car loan interest calculator',
    'auto loan emi calculator',
    'car loan monthly payment calculator',
    'car loan calculator 2026',
  ],
  alternates: { canonical: '/car-loan' },
  openGraph: {
    title: 'Car Loan EMI Calculator — Vehicle Loan Monthly Payment India',
    description: 'Free car loan EMI calculator. Get monthly payment, total interest and full repayment schedule for any vehicle loan.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Car Loan EMI Calculator',
  url: 'https://fincalc-india.vercel.app/car-loan',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function CarLoanPage() {
  return (
    <>
      <JsonLd data={calcSchema} />
      <SimpleLoanCalculator config={{
        title: 'Car Loan EMI Calculator',
        subtitle: 'Plan your car purchase — EMI, total interest and repayment schedule',
        defaultPrincipal: '800000',
        defaultRate: '9.5',
        defaultYears: '7',
        principalLabel: 'Car Loan Amount',
        emoji: '🚗',
      }} />
    </>
  );
}
