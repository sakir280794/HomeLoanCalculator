import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Simple Interest Calculator — SI = P × R × T Formula',
  description:
    'Calculate simple interest instantly using SI = P × R × T. Enter principal (P), annual interest rate (R%) and time period (T) — get simple interest and total amount with the formula shown.',
  keywords: [
    'simple interest calculator',
    'simple interest calculator india',
    'si calculator',
    'p r t calculator',
    'simple interest formula calculator',
    'si formula p x r x t',
  ],
  alternates: { canonical: '/simple-interest' },
  openGraph: {
    title: 'Simple Interest Calculator — SI = P × R × T Formula',
    description: 'Calculate simple interest using SI = P × R × T. Get total amount and interest for any principal and rate.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Simple Interest Calculator',
  url: 'https://fincalc-india.vercel.app/simple-interest',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={calcSchema} />{children}</>;
}
