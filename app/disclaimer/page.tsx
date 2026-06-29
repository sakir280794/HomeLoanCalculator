import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer — FinCalc India',
  description: 'Disclaimer for FinCalc India calculators. Results are indicative estimates for planning purposes only and do not constitute financial advice.',
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Disclaimer</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Last updated: June 2026</p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-amber-800 dark:text-amber-300 font-medium">
            Results provided by FinCalc India calculators are estimates for financial planning purposes only. They do not constitute financial, tax, investment, legal or professional advice.
          </div>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Accuracy of Calculations</h2>
            <p>Our calculators use standard industry formulas (EMI formula, compound interest, SIP future value, etc.) verified against RBI guidelines and SEBI regulations. However, actual results from banks, financial institutions, and government schemes may differ due to rounding, processing fees, scheme-specific rules, or changes in interest rates.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Not Financial Advice</h2>
            <p>Nothing on this website should be construed as financial advice. Please consult a SEBI-registered financial advisor, a chartered accountant or your bank before making any financial decision based on results from this site.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Interest Rates</h2>
            <p>Interest rates shown as defaults are indicative and based on publicly available information at the time of development. Actual rates offered by banks and NBFCs vary and change frequently. Always verify current rates directly with your lender.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Tax Calculations</h2>
            <p>Income tax calculations are based on the Finance Act for the stated financial year. Tax laws change annually. Please verify with a qualified tax professional before filing your returns.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">No Liability</h2>
            <p>FinCalc India and its operators shall not be liable for any financial loss, damage or inconvenience arising from reliance on the information or results provided by this website.</p>
          </section>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← Back to Calculators</Link>
        </div>
      </main>
    </div>
  );
}
