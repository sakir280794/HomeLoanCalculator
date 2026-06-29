import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SearchableGrid from '@/components/SearchableGrid';
import { categories } from '@/lib/calculators';
import { Star, ArrowRight, Calculator, TrendingDown, Zap, Building2 } from 'lucide-react';
import JsonLd from '@/components/JsonLd';

const siteUrl = 'https://financecalcindia.vercel.app';

export const metadata: Metadata = {
  title: 'FinCalc India — Free Financial Calculators for Loans, Investments & Tax',
  description: '24+ free financial calculators for India — home loan EMI, SIP, FD, income tax (FY 2025-26), HRA, GST, retirement, NPS and more. No signup. RBI-verified formulas.',
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'FinCalc India — Free Financial Calculators',
    description: '24+ free calculators for loans, investments, tax & retirement. India-focused, no signup, instant results.',
    url: siteUrl,
    siteName: 'FinCalc India',
    locale: 'en_IN',
    type: 'website',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FinCalc India',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

export default function HubPage() {
  const liveCount = categories.flatMap(c => c.items).filter(i => i.status === 'live').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <JsonLd data={websiteSchema} />
      <SiteHeader />

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            🇮🇳 India&apos;s Free Financial Calculator Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            FinCalc India
          </h1>
          <p className="text-indigo-200 text-lg mb-6 max-w-2xl mx-auto">
            {liveCount} free calculators — loans, investments, income tax, retirement &amp; more
          </p>

          {/* Trust pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: '✅', label: `${liveCount} Free Calculators` },
              { icon: '⚡', label: 'Instant Results' },
              { icon: '🔒', label: 'No Signup' },
              { icon: '📐', label: 'RBI-Verified Formulas' },
              { icon: '🇮🇳', label: 'FY 2025-26 Updated' },
            ].map(t => (
              <span key={t.label} className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {t.icon} {t.label}
              </span>
            ))}
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: '🏠 Home Loan', href: '/home-loan' },
              { label: '👤 Personal Loan', href: '/personal-loan' },
              { label: '🏛️ FD Calculator', href: '/fd-calculator' },
              { label: '📊 SIP Calculator', href: '/sip-calculator' },
              { label: '🧮 Income Tax', href: '/income-tax' },
              { label: '📋 GST Calculator', href: '/gst-calculator' },
            ].map(q => (
              <Link
                key={q.href}
                href={q.href}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-xl transition-colors"
              >
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Flagship: Home Loan Calculator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Flagship Calculator</span>
        </div>
        <Link
          href="/home-loan"
          className="group block bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 rounded-2xl p-7 sm:p-10 hover:shadow-2xl hover:scale-[1.01] transition-all duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">🏠</span>
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Most Comprehensive</p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">Home Loan Calculator</h2>
                </div>
              </div>
              <p className="text-indigo-200 text-sm sm:text-base mb-6 max-w-xl">
                India&apos;s most complete home loan planning tool — calculate EMI, model prepayments, boost your EMI, add a top-up loan, and see the full amortization schedule month by month.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: Calculator, label: 'EMI Calculator' },
                  { icon: TrendingDown, label: 'Prepayment Planner' },
                  { icon: Zap, label: 'EMI Booster' },
                  { icon: Building2, label: 'Top-Up Loan' },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                    <f.icon className="w-4 h-4 text-indigo-200 shrink-0" />
                    <span className="text-xs font-semibold text-white">{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-xl group-hover:bg-indigo-50 transition-colors">
                Open Calculator <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <div className="hidden sm:flex flex-col gap-2 text-right shrink-0">
              {['EMI', 'Total Interest', 'Prepayment Savings', 'Amortization Table'].map(tag => (
                <span key={tag} className="text-xs font-medium text-indigo-200 bg-white/10 px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </Link>
      </div>

      {/* Searchable calculator grid */}
      <div className="pt-10">
        <SearchableGrid categories={categories} />
      </div>

      <SiteFooter />
    </div>
  );
}
