import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator — A = P(1 + r/n)^nt Formula',
  description:
    'Calculate compound interest with any compounding frequency — annual, quarterly, monthly or daily. Enter principal, rate and time — get total interest and final amount using the CI formula A = P(1 + r/n)^nt.',
  keywords: [
    'compound interest calculator',
    'compound interest calculator india',
    'ci calculator',
    'compound interest formula calculator',
    'quarterly compounding calculator',
    'monthly compounding calculator',
    'compound interest vs simple interest',
  ],
  alternates: { canonical: '/compound-interest' },
  openGraph: {
    title: 'Compound Interest Calculator — A = P(1 + r/n)^nt Formula',
    description: 'Calculate compound interest for any principal, rate and time with different compounding frequencies.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Compound Interest Calculator',
  url: 'https://financecalcindia.vercel.app/compound-interest',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={calcSchema} />{children}</>;
}
