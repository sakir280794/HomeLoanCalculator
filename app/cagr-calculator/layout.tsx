import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'CAGR Calculator — Compound Annual Growth Rate India',
  description: 'Calculate CAGR from initial and final investment values, or find future value at a given CAGR. Free compound annual growth rate calculator with benchmark comparison.',
  keywords: ['cagr calculator', 'compound annual growth rate calculator', 'cagr calculator india', 'investment return calculator', 'stock cagr calculator', 'mutual fund cagr calculator', 'portfolio cagr calculator'],
  alternates: { canonical: '/cagr-calculator' },
  openGraph: { title: 'CAGR Calculator — Compound Annual Growth Rate India', description: 'Calculate CAGR or project future value of any investment. Compare against market benchmarks.' },
};

const schema = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'CAGR Calculator India', url: 'https://financecalcindia.vercel.app/cagr-calculator', applicationCategory: 'FinanceApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={schema} />{children}</>;
}
