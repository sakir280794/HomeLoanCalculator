import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'NPS Calculator — National Pension System Corpus & Pension',
  description: 'Calculate NPS corpus and monthly pension at retirement. Enter monthly contribution, age and expected return — get total corpus, lump sum withdrawal and monthly annuity pension.',
  keywords: ['nps calculator', 'national pension system calculator', 'nps corpus calculator', 'nps pension calculator india', 'nps return calculator', 'nps maturity calculator', 'nps tax benefit calculator'],
  alternates: { canonical: '/nps-calculator' },
  openGraph: { title: 'NPS Calculator — National Pension System Corpus & Pension', description: 'Calculate NPS corpus, lump sum and monthly pension for retirement planning.' },
};

const schema = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'NPS Calculator India', url: 'https://financecalcindia.vercel.app/nps-calculator', applicationCategory: 'FinanceApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={schema} />{children}</>;
}
