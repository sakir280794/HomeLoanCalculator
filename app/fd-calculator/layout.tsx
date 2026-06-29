import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'FD Calculator — Fixed Deposit Maturity Amount & Interest',
  description:
    'Calculate fixed deposit (FD) maturity amount with compound interest. Enter principal, FD interest rate, tenure and compounding frequency — get exact maturity value, interest earned and effective annual rate instantly.',
  keywords: [
    'fd calculator',
    'fixed deposit calculator',
    'fd maturity calculator',
    'fixed deposit interest calculator india',
    'fd calculator india 2026',
    'fd interest calculator',
    'bank fd calculator',
    'fd compound interest calculator',
  ],
  alternates: { canonical: '/fd-calculator' },
  openGraph: {
    title: 'FD Calculator — Fixed Deposit Maturity Amount & Interest',
    description: 'Calculate FD maturity amount, interest earned and effective annual rate for any fixed deposit.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Fixed Deposit (FD) Calculator',
  url: 'https://home-loan-calculator-ivory.vercel.app/fd-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  description: 'Calculate FD maturity amount with compound interest for any Indian bank FD.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is FD interest calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FD maturity amount = P × (1 + r/n)^(nt), where P = principal, r = annual interest rate, n = compounding frequency per year (4 for quarterly), t = tenure in years. Most Indian banks compound quarterly.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the current FD interest rate in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In 2026, most major Indian banks offer FD rates between 6.5% to 7.5% for general citizens and up to 8% for senior citizens. Rates vary by bank and tenure — always check with your bank for the latest rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is FD interest taxable in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, FD interest is taxable as per your income tax slab. Banks deduct TDS at 10% if annual interest exceeds ₹40,000 (₹50,000 for senior citizens). You must declare all FD interest in your ITR.',
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={calcSchema} />
      <JsonLd data={faqSchema} />
      {children}
    </>
  );
}
