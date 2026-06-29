import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'GST Calculator India — CGST, SGST Split with 5/12/18/28% Rates',
  description:
    'Free GST calculator for India. Calculate GST, CGST and SGST on any amount — choose exclusive (add GST) or inclusive (extract GST) mode with 5%, 12%, 18%, 28% rates or custom rate.',
  keywords: [
    'gst calculator',
    'gst calculator india',
    'cgst sgst calculator',
    'gst inclusive exclusive calculator',
    'gst calculation online',
    '18 percent gst calculator',
    'goods and services tax calculator india',
    'gst amount calculator',
  ],
  alternates: { canonical: '/gst-calculator' },
  openGraph: {
    title: 'GST Calculator India — CGST, SGST Split with 5/12/18/28% Rates',
    description: 'Calculate GST with CGST and SGST split for any amount. Supports exclusive and inclusive GST modes.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'GST Calculator India',
  url: 'https://home-loan-calculator-ivory.vercel.app/gst-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  description: 'Calculate GST, CGST and SGST on any amount with inclusive/exclusive mode.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the GST rates in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GST rates in India: 0% (essential food, healthcare), 5% (essential food, transport, economy hotels), 12% (processed food, mobile phones, business class hotels), 18% (most services, electronics, restaurants), 28% (luxury goods, automobiles, tobacco, aerated drinks).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between CGST and SGST?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For intra-state transactions, GST is split equally between CGST (Central GST, collected by central government) and SGST (State GST, collected by state government). For example, 18% GST = 9% CGST + 9% SGST. For inter-state transactions, IGST applies instead.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to calculate GST on an inclusive price?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To extract GST from an inclusive price: Base Amount = Total Price ÷ (1 + GST Rate/100). GST Amount = Total Price − Base Amount. For example, if the inclusive price is ₹11,800 at 18% GST: Base = ₹11,800 ÷ 1.18 = ₹10,000. GST = ₹1,800.',
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
