import type { Metadata } from 'next';
import SimpleLoanCalculator from '@/components/SimpleLoanCalculator';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'EMI Calculator — Monthly Loan EMI & Amortization Schedule',
  description:
    'Universal EMI calculator for any loan — home loan, personal loan, car loan, education loan and more. Enter principal, interest rate and tenure to calculate monthly EMI and full amortization schedule.',
  keywords: [
    'emi calculator',
    'emi calculator india',
    'loan emi calculator',
    'monthly emi calculator',
    'emi formula calculator',
    'emi calculator online india',
    'loan calculator india',
    'emi calculator 2026',
  ],
  alternates: { canonical: '/emi-calculator' },
  openGraph: {
    title: 'EMI Calculator — Monthly Loan EMI & Amortization Schedule',
    description: 'Universal EMI calculator for any loan type. Calculate monthly EMI and full amortization schedule instantly.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EMI Calculator',
  url: 'https://fincalc-india.vercel.app/emi-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  description: 'Universal EMI calculator — works for any loan type including home loan, car loan and personal loan.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the EMI formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'EMI = P × R × (1+R)^N / ((1+R)^N − 1), where P = Principal loan amount, R = Monthly interest rate (Annual Rate ÷ 12 ÷ 100), N = Loan tenure in months. For example, a ₹10 lakh loan at 10% for 5 years gives EMI = ₹21,247.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to reduce EMI without prepayment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can reduce EMI by: (1) Extending the loan tenure — longer tenure = lower monthly EMI but higher total interest. (2) Negotiating a lower interest rate with your bank. (3) Making a balance transfer to a lender with a lower rate. (4) Making a partial prepayment to reduce the principal and opt for reduced EMI.',
      },
    },
  ],
};

export default function EMICalculatorPage() {
  return (
    <>
      <JsonLd data={calcSchema} />
      <JsonLd data={faqSchema} />
      <SimpleLoanCalculator config={{
        title: 'EMI Calculator',
        subtitle: 'Universal EMI calculator — works for any loan type',
        defaultPrincipal: '1000000',
        defaultRate: '10',
        defaultYears: '10',
        principalLabel: 'Loan Amount',
        emoji: '🧮',
      }} />
    </>
  );
}
