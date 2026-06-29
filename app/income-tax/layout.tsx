import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Income Tax Calculator FY 2025-26 — Old vs New Regime',
  description: 'Free income tax calculator for FY 2025-26. Compare old regime vs new regime, calculate tax on salary with 80C, 80D, HRA deductions. Find which regime saves you more tax.',
  keywords: ['income tax calculator', 'income tax calculator 2025-26', 'old vs new tax regime calculator', 'income tax calculator india', 'salary tax calculator india', 'new tax regime calculator', '80c deduction calculator', 'tax saving calculator india'],
  alternates: { canonical: '/income-tax' },
  openGraph: { title: 'Income Tax Calculator FY 2025-26 — Old vs New Regime', description: 'Compare old vs new tax regime and find which saves you more. Free income tax calculator for India.' },
};

const schema = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Income Tax Calculator India', url: 'https://financecalcindia.vercel.app/income-tax', applicationCategory: 'FinanceApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' } };

const faq = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What are the new tax regime slabs for FY 2025-26?', acceptedAnswer: { '@type': 'Answer', text: 'New regime FY 2025-26: 0% up to ₹4L, 5% (₹4L-8L), 10% (₹8L-12L), 15% (₹12L-16L), 20% (₹16L-20L), 25% (₹20L-24L), 30% above ₹24L. Standard deduction ₹75,000. No tax up to ₹12L income (rebate u/s 87A).' } },
    { '@type': 'Question', name: 'Should I choose old or new tax regime?', acceptedAnswer: { '@type': 'Answer', text: 'New regime is better if your total deductions (80C + 80D + HRA + other) are less than ₹3.75L. If you have high 80C investments, home loan interest, and HRA exemption, old regime may save more. Use our calculator to compare.' } },
    { '@type': 'Question', name: 'What is the standard deduction in new tax regime?', acceptedAnswer: { '@type': 'Answer', text: 'Standard deduction is ₹75,000 in the new tax regime for FY 2025-26 (increased from ₹50,000). In old regime, standard deduction is ₹50,000.' } },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={schema} /><JsonLd data={faq} />{children}</>;
}
