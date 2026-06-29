import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'HRA Calculator — House Rent Allowance Exemption India',
  description: 'Calculate HRA exemption from income tax. Enter basic salary, DA, HRA received and rent paid — get exact tax-exempt HRA using all 3 conditions. Metro and non-metro city support.',
  keywords: ['hra calculator', 'hra exemption calculator', 'house rent allowance calculator india', 'hra tax exemption calculator', 'hra calculation formula', 'metro non metro hra calculator'],
  alternates: { canonical: '/hra-calculator' },
  openGraph: { title: 'HRA Calculator — House Rent Allowance Exemption India', description: 'Calculate HRA tax exemption using all 3 conditions. For metro and non-metro cities.' },
};

const schema = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'HRA Calculator India', url: 'https://financecalcindia.vercel.app/hra-calculator', applicationCategory: 'FinanceApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={schema} />{children}</>;
}
