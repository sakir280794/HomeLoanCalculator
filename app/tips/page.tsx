import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { ChevronRight, Calculator } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Top Home Loan Tips — Smart Borrowing Guide',
  description: 'Practical tips to reduce home loan interest, plan prepayments, use EMI booster effectively, and close your loan years early.',
};

const tips = [
  {
    number: '01',
    title: 'Negotiate your interest rate before signing',
    color: 'indigo',
    content:
      'Most borrowers accept the offered rate without negotiation. Your credit score, existing relationship with the bank, and loan amount all give you leverage. A 0.25% reduction on ₹50 lakh over 20 years saves roughly ₹3 lakh in interest. Always compare at least 3 banks before deciding.',
  },
  {
    number: '02',
    title: 'Choose the shortest tenure you can afford',
    color: 'emerald',
    content:
      'A 15-year loan on ₹50 lakh at 8.5% saves ₹17 lakh compared to a 20-year loan. Yes, the EMI is higher (₹49,238 vs ₹43,391) but the long-term savings are dramatic. If you can manage the higher EMI, always go shorter. Use our calculator to find the breakeven tenure for your income.',
  },
  {
    number: '03',
    title: 'Make your first prepayment in Year 1 or 2',
    color: 'amber',
    content:
      'The earlier you prepay, the more you save. ₹1 lakh prepaid in Year 1 saves about ₹1.9 lakh in interest. The same ₹1 lakh prepaid in Year 10 saves only ₹70,000. Your first bonus, tax refund, or any windfall should go straight to the loan in the early years.',
  },
  {
    number: '04',
    title: 'Direct salary increments to EMI Booster',
    color: 'purple',
    content:
      'When you get a pay raise, resist the urge to upgrade your lifestyle. Instead, boost your EMI by the net increment amount. Boosting EMI from ₹43,391 to ₹50,000 on a ₹50 lakh loan saves approximately ₹10 lakh and closes the loan 3.5 years early. You won\'t miss money you never started spending.',
  },
  {
    number: '05',
    title: 'Use lump sum payments strategically',
    color: 'rose',
    content:
      'Annual bonus, LTA payout, matured FDs, freelance income — any large irregular inflow should be evaluated against your loan. If your FD rate (post-tax) is lower than your home loan rate, use the FD maturity to prepay. Use our lump sum prepayment feature to model multiple payments across different dates.',
  },
  {
    number: '06',
    title: 'Always choose "Reduce Tenure" over "Reduce EMI"',
    color: 'teal',
    content:
      'When you make a prepayment, banks give you two options: reduce your EMI (keep tenure) or reduce your tenure (keep EMI). Always choose Reduce Tenure unless you have a cash flow problem. Reducing tenure gets you out of debt faster and saves significantly more interest over the remaining loan period.',
  },
  {
    number: '07',
    title: 'Check prepayment charges before paying',
    color: 'orange',
    content:
      'RBI prohibits prepayment charges on floating rate home loans. If you have a floating rate loan, you can prepay any amount without penalty. Fixed rate loans may have a 2-4% charge. Always verify with your bank before making a large prepayment — the savings must exceed the fee.',
  },
  {
    number: '08',
    title: 'Review your interest rate every 2-3 years',
    color: 'cyan',
    content:
      'Interest rates change over time. If rates have fallen significantly since you took the loan, a balance transfer to another bank at a lower rate could save lakhs. The math works best in the first 8-10 years when outstanding principal is high. Balance transfer costs (processing fee, legal charges) typically pay back within 18-24 months if the rate difference is 0.5% or more.',
  },
  {
    number: '09',
    title: 'Be careful with top-up loans',
    color: 'slate',
    content:
      'Top-up loans are convenient but come at a 0.5-1.5% higher rate than your home loan. Avoid them for non-essential purposes. If unavoidable, choose the shortest possible tenure and treat it as a high-priority debt to close quickly. Use our Top-Up calculator to see the total combined impact before applying.',
  },
  {
    number: '10',
    title: 'Track your loan with an amortization schedule',
    color: 'indigo',
    content:
      'Most borrowers have no idea how much of their EMI goes to interest vs principal each month. Reviewing your amortization schedule once a year keeps you aware and motivated. Our calculator\'s amortization table shows you exactly this — and lets you see the impact of any prepayment or EMI boost before you commit to it.',
  },
];

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-600',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-500',
  purple: 'bg-purple-600',
  rose: 'bg-rose-600',
  teal: 'bg-teal-600',
  orange: 'bg-orange-500',
  cyan: 'bg-cyan-600',
  slate: 'bg-slate-600',
};

export default function TipsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 dark:text-gray-200">Loan Tips</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          10 Smart Home Loan Tips
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base mb-10 max-w-2xl">
          Actionable tips to reduce total interest, close your loan early, and make every rupee work harder for you.
        </p>

        <div className="space-y-5">
          {tips.map(tip => (
            <div
              key={tip.number}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 flex gap-5"
            >
              <div className={`${colorMap[tip.color] ?? 'bg-indigo-600'} text-white text-xs font-bold w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                {tip.number}
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">{tip.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{tip.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Model these strategies yourself</h3>
          <p className="text-indigo-200 text-sm mb-5">Enter your loan details and see exactly how much each tip saves you.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Open Calculator
          </Link>
        </div>
      </main>
    </div>
  );
}
