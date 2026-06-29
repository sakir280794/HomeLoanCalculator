import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Lumpsum Investment Calculator — One-Time Mutual Fund Returns',
  description:
    'Calculate returns on a one-time lumpsum mutual fund investment. Enter investment amount, expected annual return and period — get maturity value, total gains and return on investment instantly.',
  keywords: [
    'lumpsum calculator',
    'lumpsum investment calculator',
    'one time investment calculator',
    'lumpsum mutual fund calculator',
    'lumpsum return calculator india',
    'lump sum investment calculator',
  ],
  alternates: { canonical: '/lumpsum-calculator' },
  openGraph: {
    title: 'Lumpsum Investment Calculator — One-Time Mutual Fund Returns',
    description: 'Calculate lumpsum mutual fund investment returns. Get maturity value, gains and ROI for any one-time investment.',
  },
};

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Lumpsum Investment Calculator',
  url: 'https://fincalc-india.vercel.app/lumpsum-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={calcSchema} />{children}</>;
}
