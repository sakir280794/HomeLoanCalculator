import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'PPF Calculator — Public Provident Fund Maturity & Interest',
  description:
    'Calculate PPF maturity amount at 7.1% interest. Free Public Provident Fund calculator — enter yearly deposit amount and tenure to get tax-free maturity value and total interest earned.',
  keywords: [
    'ppf calculator',
    'public provident fund calculator',
    'ppf maturity calculator',
    'ppf interest calculator',
    'ppf calculator india 2026',
    'ppf tax free return calculator',
    'ppf 15 year calculator',
  ],
  alternates: { canonical: '/ppf-calculator' },
  openGraph: {
    title: 'PPF Calculator — Public Provident Fund Maturity & Interest',
    description: 'Calculate PPF maturity amount and tax-free interest for any yearly deposit. Current rate: 7.1% p.a.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PPF Calculator',
  url: 'https://home-loan-calculator-ivory.vercel.app/ppf-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  description: 'Calculate Public Provident Fund maturity amount with tax-free compound interest.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={calcSchema} />{children}</>;
}
