import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import FinBot from '@/components/FinBot';
import JsonLd from '@/components/JsonLd';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const siteUrl = 'https://financecalcindia.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FinCalc India — Free Financial Calculators for India',
    template: '%s | FinCalc India',
  },
  description:
    'Free financial calculators for India — Home Loan EMI, SIP, FD, PPF, Personal Loan, Car Loan, GST, Gratuity, Compound Interest and 60+ more. Instant results, no signup required.',
  keywords: [
    'financial calculator india',
    'home loan calculator',
    'emi calculator india',
    'sip calculator',
    'fd calculator',
    'ppf calculator',
    'gst calculator india',
    'gratuity calculator',
    'personal loan emi calculator',
    'car loan calculator',
    'compound interest calculator',
    'loan calculator india',
    'investment calculator india',
    'free financial calculator',
    'fincalc india',
  ],
  authors: [{ name: 'Sakirhusain Syed' }],
  creator: 'Sakirhusain Syed',
  publisher: 'FinCalc India',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'FinCalc India',
    title: 'FinCalc India — Free Financial Calculators for India',
    description: 'Free financial calculators for India — Home Loan EMI, SIP, FD, PPF, GST, Gratuity and 60+ more. Instant results.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinCalc India — Free Financial Calculators for India',
    description: 'Free financial calculators for India — Home Loan EMI, SIP, FD, PPF, GST, Gratuity and 60+ more.',
    creator: '@sakirhusainsyed',
  },
  verification: { google: 'Kd6uvSK9rhTcaRJcXq6i59T_dpa8NOaeXXBWexmOKM4' },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#org`,
      name: 'FinCalc India',
      url: siteUrl,
      description: 'Free financial calculators for India',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'FinCalc India',
      publisher: { '@id': `${siteUrl}/#org` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">
        <JsonLd data={orgSchema} />
        {children}
        <FinBot />
      </body>
    </html>
  );
}
