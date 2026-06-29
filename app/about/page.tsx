import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About FinCalc India — Free Financial Calculators for India',
  description: 'About FinCalc India — a free financial calculator platform built for Indian investors, borrowers and taxpayers. 24+ calculators, no signup, no ads.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">About FinCalc India</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">India&apos;s Free Financial Calculator Hub</p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <p className="text-base">
            FinCalc India is a free, no-signup financial calculator platform built specifically for Indian users — covering home loans, investments, taxes, retirement planning and more.
          </p>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Why We Built This</h2>
            <p>Financial decisions in India are complex — EMI calculations, tax regime comparisons, SIP projections, HRA exemptions. Most tools are either too generic (not India-specific), ad-heavy, or require creating an account. We built FinCalc India to be the one place where every Indian can calculate anything financial, instantly and for free.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">What We Offer</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>24+ live calculators across loans, investments, tax, retirement, property</li>
              <li>Standard industry formulas verified against RBI guidelines</li>
              <li>Income tax calculations updated for FY 2025-26</li>
              <li>No registration, no ads, no hidden fees — forever free</li>
              <li>Mobile-optimised design for on-the-go calculations</li>
              <li>AI financial chatbot (FinBot) with formula-based recommendations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Our Formula Accuracy</h2>
            <p>All calculators use standard formulas:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>EMI:</strong> P × R × (1+R)^N / ((1+R)^N − 1) — as per RBI standard</li>
              <li><strong>SIP:</strong> M × ((1+r)^n − 1) / r × (1+r) — SEBI standard formula</li>
              <li><strong>Income Tax:</strong> As per Finance Act 2025 (FY 2025-26)</li>
              <li><strong>Gratuity:</strong> As per Payment of Gratuity Act, 1972</li>
              <li><strong>HRA:</strong> Minimum of 3 conditions per Section 10(13A)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Contact</h2>
            <p>Questions, feedback or suggestions? Reach us at: <a href="mailto:contact@financecalcindia.in" className="text-indigo-600 dark:text-indigo-400">contact@financecalcindia.in</a></p>
          </section>
        </div>

        <div className="mt-10 flex gap-4">
          <Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← All Calculators</Link>
          <Link href="/disclaimer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Disclaimer</Link>
          <Link href="/privacy" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link>
        </div>
      </main>
    </div>
  );
}
