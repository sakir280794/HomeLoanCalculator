import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'RD Calculator — Recurring Deposit Maturity Amount India',
  description: 'Calculate recurring deposit (RD) maturity amount with quarterly compounding. Enter monthly deposit, tenure and interest rate — get exact maturity value and interest earned.',
  keywords: ['rd calculator', 'recurring deposit calculator', 'rd maturity calculator india', 'rd interest calculator', 'post office rd calculator', 'bank rd calculator india', 'monthly deposit calculator'],
  alternates: { canonical: '/rd-calculator' },
  openGraph: { title: 'RD Calculator — Recurring Deposit Maturity Amount India', description: 'Calculate RD maturity amount with quarterly compounding. Works for all bank and post office RDs.' },
};

const schema = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'RD Calculator India', url: 'https://financecalcindia.vercel.app/rd-calculator', applicationCategory: 'FinanceApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={schema} />{children}</>;
}
