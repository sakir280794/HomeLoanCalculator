import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Retirement Calculator India — How Much Corpus Do You Need?',
  description: 'Calculate the retirement corpus you need based on monthly expenses, inflation and life expectancy. Find the monthly SIP required to retire comfortably in India.',
  keywords: ['retirement calculator india', 'retirement corpus calculator', 'how much to retire india', 'retirement planning calculator', 'retirement savings calculator india', 'fire calculator india', 'early retirement calculator india'],
  alternates: { canonical: '/retirement' },
  openGraph: { title: 'Retirement Calculator India — Corpus Needed & Monthly SIP', description: 'Calculate retirement corpus, monthly expenses at retirement and SIP needed to retire comfortably.' },
};

const schema = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Retirement Calculator India', url: 'https://financecalcindia.vercel.app/retirement', applicationCategory: 'FinanceApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' } };

const faq = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How much corpus is needed to retire in India?', acceptedAnswer: { '@type': 'Answer', text: 'A common rule is 25-30× your annual expenses (the 4% rule). For ₹50,000/month expenses at retirement, you need ~₹1.5-2 crore. However, India-specific factors like inflation (6%), post-retirement returns and life expectancy vary. Use our calculator for a personalized estimate.' } },
    { '@type': 'Question', name: 'What is the 25x rule for retirement?', acceptedAnswer: { '@type': 'Answer', text: 'The 25x rule says you need 25 times your annual expenses as a retirement corpus. If you spend ₹6L/year at retirement, you need ₹1.5 crore. This assumes 4% safe withdrawal rate. In India, a 30x corpus (3.3% withdrawal) is safer due to higher inflation.' } },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={schema} /><JsonLd data={faq} />{children}</>;
}
