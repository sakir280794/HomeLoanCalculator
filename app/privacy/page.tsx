import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — FinCalc India',
  description: 'Privacy Policy for FinCalc India. We do not collect personal data. All calculations happen locally in your browser.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Last updated: June 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">1. No Personal Data Collection</h2>
            <p>FinCalc India does not require registration, login or any personal information to use any calculator. All financial calculations are performed entirely within your browser — no data is sent to our servers.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">2. What We Don't Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name, email address or any personally identifiable information</li>
              <li>Loan amounts, salaries, investments or financial data you enter into calculators</li>
              <li>Payment or banking information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">3. Analytics</h2>
            <p>We may use anonymised, aggregated analytics (such as page views and most-used calculators) to improve the service. This data cannot be used to identify individual users.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">4. Cookies</h2>
            <p>We use minimal cookies strictly necessary for the site to function (e.g., dark mode preference). We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">5. Third-Party Services</h2>
            <p>The site is hosted on Vercel. Their privacy policy governs infrastructure-level data. We do not share any user data with third parties for marketing or advertising purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">6. Contact</h2>
            <p>For privacy questions, contact us at: <a href="mailto:contact@financecalcindia.in" className="text-indigo-600 dark:text-indigo-400">contact@financecalcindia.in</a></p>
          </section>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← Back to Calculators</Link>
        </div>
      </main>
    </div>
  );
}
