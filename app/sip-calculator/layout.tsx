import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'SIP Calculator — Mutual Fund Returns Estimator India',
  description:
    'Calculate SIP returns and final corpus for any mutual fund investment. Enter monthly SIP amount, expected annual return and investment period — get total corpus, invested amount and estimated gains instantly.',
  keywords: [
    'sip calculator',
    'sip return calculator',
    'mutual fund sip calculator',
    'systematic investment plan calculator',
    'sip calculator india',
    'sip maturity calculator',
    'monthly sip calculator',
    'sip corpus calculator',
  ],
  alternates: { canonical: '/sip-calculator' },
  openGraph: {
    title: 'SIP Calculator — Mutual Fund Returns Estimator India',
    description: 'Calculate SIP corpus, total returns and wealth gained for any monthly mutual fund SIP.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SIP Calculator',
  url: 'https://financecalcindia.vercel.app/sip-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  description: 'Estimate SIP returns and final corpus for systematic investment plans in mutual funds.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is SIP return calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SIP future value = M × ((1 + r)^n − 1) / r × (1 + r), where M = monthly SIP amount, r = monthly interest rate (annual rate ÷ 12 ÷ 100), n = number of months. For ₹5,000/month at 12% for 10 years, the corpus is approximately ₹11.6 lakh.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a good SIP return to expect in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Historically, Nifty 50 has delivered approximately 12-13% CAGR over the past 20 years. Diversified equity mutual funds have averaged 11-15% over long periods. For conservative planning, use 10-12% as an assumed return. Past performance does not guarantee future results.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is SIP better than FD for long-term investment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For investment horizons of 7+ years, SIP in equity mutual funds has historically outperformed FD returns. ₹5,000/month for 10 years at 12% (SIP) gives ~₹11.6 lakh vs ~₹8.7 lakh at 7% (FD). However, SIP returns are market-linked and not guaranteed.',
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
