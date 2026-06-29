import type { Metadata } from 'next';
import SimpleLoanCalculator from '@/components/SimpleLoanCalculator';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Bike Loan EMI Calculator — Two-Wheeler Loan Monthly EMI',
  description:
    'Calculate two-wheeler / bike loan EMI, total interest and monthly repayment schedule instantly. Free bike loan calculator for scooters, motorcycles and electric vehicles in India.',
  keywords: [
    'bike loan emi calculator',
    'two wheeler loan emi calculator',
    'two wheeler loan calculator india',
    'bike loan interest calculator',
    'scooter loan emi calculator',
    'motorcycle loan calculator',
    'electric scooter loan calculator',
  ],
  alternates: { canonical: '/bike-loan' },
  openGraph: {
    title: 'Bike Loan EMI Calculator — Two-Wheeler Loan Monthly EMI',
    description: 'Free two-wheeler loan EMI calculator. Calculate bike loan monthly payment, interest and schedule.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bike Loan EMI Calculator',
  url: 'https://home-loan-calculator-ivory.vercel.app/bike-loan',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function BikeLoanPage() {
  return (
    <>
      <JsonLd data={calcSchema} />
      <SimpleLoanCalculator config={{
        title: 'Bike Loan EMI Calculator',
        subtitle: 'Two-wheeler loan EMI and repayment planner',
        defaultPrincipal: '150000',
        defaultRate: '11',
        defaultYears: '3',
        principalLabel: 'Two-Wheeler Loan Amount',
        emoji: '🏍️',
      }} />
    </>
  );
}
