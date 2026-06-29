import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Child Education Planning Calculator — Future Education Corpus India',
  description: 'Calculate the corpus needed for your child\'s higher education. Enter child\'s age, education cost, inflation and savings — get future cost and monthly SIP required to meet the goal.',
  keywords: ['child education calculator', 'education planning calculator india', 'child education corpus calculator', 'future education cost calculator', 'education savings calculator india', 'college planning calculator india'],
  alternates: { canonical: '/child-education' },
  openGraph: { title: 'Child Education Planning Calculator India', description: 'Plan your child\'s education corpus. Get future cost and monthly SIP needed accounting for inflation.' },
};

const schema = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Child Education Planning Calculator', url: 'https://financecalcindia.vercel.app/child-education', applicationCategory: 'FinanceApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={schema} />{children}</>;
}
