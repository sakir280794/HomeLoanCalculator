import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = 'https://home-loan-calculator-ivory.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Home Loan Calculator – EMI, Prepayment, Top-Up & EMI Booster',
    template: '%s | Home Loan Calculator',
  },
  description:
    'Free all-in-one home loan calculator. Calculate EMI, plan prepayments (part payments), top-up loans, EMI booster, reduced EMI & reduced tenure — all in one place. Get instant amortization schedules and see how much interest you save.',
  keywords: [
    'home loan calculator',
    'EMI calculator',
    'home loan EMI calculator',
    'prepayment calculator',
    'part payment home loan',
    'home loan prepayment',
    'top up loan calculator',
    'EMI booster',
    'reduce EMI',
    'reduce tenure',
    'reduced term home loan',
    'home loan amortization',
    'loan calculator India',
    'housing loan calculator',
    'calculate home loan',
    'home loan interest calculator',
    'lump sum prepayment',
    'home loan part payment calculator',
    'mortgage calculator India',
  ],
  authors: [{ name: 'Sakirhusain Syed' }],
  creator: 'Sakirhusain Syed',
  publisher: 'Sakirhusain Syed',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Home Loan Calculator',
    title: 'Home Loan Calculator – EMI, Prepayment, Top-Up & EMI Booster',
    description:
      'All-in-one home loan calculator. Plan EMI, prepayments, part payments, top-up loans, EMI booster and see your amortization schedule instantly.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Loan Calculator – EMI, Prepayment, Top-Up & EMI Booster',
    description:
      'All-in-one home loan calculator. Plan EMI, prepayments, part payments, top-up loans, EMI booster and see your amortization schedule instantly.',
    creator: '@sakirhusainsyed',
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: 'Kd6uvSK9rhTcaRJcXq6i59T_dpa8NOaeXXBWexmOKM4',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
