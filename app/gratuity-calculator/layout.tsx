import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Gratuity Calculator India — Payment of Gratuity Act 1972',
  description:
    'Calculate gratuity as per the Payment of Gratuity Act, 1972. Enter last drawn salary (Basic + DA) and years of service — get exact gratuity amount with tax exemption details and taxable portion.',
  keywords: [
    'gratuity calculator',
    'gratuity calculator india',
    'gratuity act calculator',
    'gratuity formula calculator',
    'gratuity calculation india 2026',
    'payment of gratuity act calculator',
    'gratuity amount calculator',
    'gratuity tax exemption calculator',
  ],
  alternates: { canonical: '/gratuity-calculator' },
  openGraph: {
    title: 'Gratuity Calculator India — Payment of Gratuity Act 1972',
    description: 'Calculate gratuity amount per the Gratuity Act 1972. Enter salary and years of service for instant results.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gratuity Calculator India',
  url: 'https://fincalc-india.vercel.app/gratuity-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the formula for gratuity calculation in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For employees covered under the Gratuity Act (10+ employees): Gratuity = (15 × Last Salary × Years of Service) ÷ 26. For non-covered establishments: (15 × Last Salary × Years) ÷ 30. "Last Salary" means Basic + Dearness Allowance (DA).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum service period for gratuity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An employee must complete a minimum of 5 years of continuous service to be eligible for gratuity. In the case of death or disablement, the 5-year condition is waived and gratuity is paid to the nominee.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is gratuity taxable in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gratuity received by government employees is fully exempt. For private sector employees covered under the Gratuity Act, gratuity up to ₹20 lakh is exempt from income tax. Amount above ₹20 lakh is taxable as per income tax slab rates.',
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
