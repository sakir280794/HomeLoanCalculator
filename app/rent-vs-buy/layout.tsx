import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Rent vs Buy Calculator India — Should You Rent or Buy a Home?',
  description: 'Compare the total cost of renting vs buying a home in India. Find your break-even year, net cost after appreciation and investment returns, and make the right decision.',
  keywords: ['rent vs buy calculator india', 'should i rent or buy a house india', 'rent vs buy comparison', 'home buying calculator india', 'rent vs emi calculator', 'property vs rent calculator'],
  alternates: { canonical: '/rent-vs-buy' },
  openGraph: { title: 'Rent vs Buy Calculator India — Should You Rent or Buy?', description: 'Find your rent vs buy break-even year. Compare net cost with appreciation and investment returns.' },
};

const schema = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Rent vs Buy Calculator India', url: 'https://financecalcindia.vercel.app/rent-vs-buy', applicationCategory: 'FinanceApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={schema} />{children}</>;
}
