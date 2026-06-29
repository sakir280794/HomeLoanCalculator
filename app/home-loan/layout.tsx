import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Home Loan EMI Calculator — Prepayment, Top-Up & EMI Booster',
  description:
    'Free home loan EMI calculator with prepayment planner, EMI booster and top-up loan. Calculate monthly EMI, total interest saved and full amortization schedule for Indian home loans at any interest rate.',
  keywords: [
    'home loan calculator',
    'home loan emi calculator',
    'housing loan calculator',
    'home loan prepayment calculator',
    'part payment home loan',
    'emi booster home loan',
    'top up home loan calculator',
    'home loan amortization schedule',
    'reduce emi calculator',
    'reduce tenure calculator',
    'mortgage calculator india',
    'home loan interest calculator',
    'lump sum prepayment calculator',
  ],
  alternates: { canonical: '/home-loan' },
  openGraph: {
    title: 'Home Loan EMI Calculator — Prepayment, Top-Up & EMI Booster',
    description: 'Calculate home loan EMI, plan prepayments, use EMI booster and add top-up loan — all in one free calculator.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Home Loan EMI Calculator',
  url: 'https://home-loan-calculator-ivory.vercel.app/home-loan',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  description: 'Calculate home loan EMI, prepayment savings, EMI booster impact and top-up loan combined cost.',
  featureList: ['EMI Calculator', 'Prepayment Planner', 'EMI Booster', 'Top-Up Loan', 'Amortization Table', 'Loan Charts'],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is home loan EMI calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Home loan EMI = P × R × (1+R)^N / ((1+R)^N − 1), where P = principal, R = monthly interest rate (annual rate ÷ 1200), N = tenure in months. For example, a ₹30 lakh loan at 8.5% for 20 years gives an EMI of ₹26,035.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the benefit of prepayment on a home loan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prepayment directly reduces the outstanding principal. On a ₹30 lakh loan at 8.5%, paying ₹1 lakh extra in Year 1 saves approximately ₹1.9 lakh in interest and closes the loan 5 months early. The earlier you prepay, the more you save.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is EMI Booster?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'EMI Booster lets you voluntarily increase your monthly EMI from a specific date — for example after a salary hike. A higher EMI repays more principal each month, closing your loan earlier and saving significant interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I prepay a home loan without penalty in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. RBI regulations prohibit banks from charging prepayment penalties on floating rate home loans. Since most Indian home loans are floating rate, you can prepay any amount at any time without any fee.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I reduce EMI or reduce tenure when making a prepayment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Reducing tenure saves more total interest because you exit debt faster. Reducing EMI is better if you need lower monthly outflow. For maximum savings, always choose reduce tenure if your cash flow allows.',
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
