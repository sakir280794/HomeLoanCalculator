import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { ChevronRight, Calculator, TrendingUp, ArrowUpCircle, Building2, BarChart3, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Use the Home Loan Calculator',
  description: 'Step-by-step guide to using the Home Loan Calculator — EMI, prepayment, EMI booster, top-up loan, and amortization table explained.',
};

const steps = [
  {
    icon: Calculator,
    color: 'indigo',
    title: 'Step 1: Enter Loan Details',
    id: 'loan-details',
    content: [
      {
        subtitle: 'Property Value & Down Payment',
        text: 'Enter your property value and down payment. You can enter the down payment as an amount (₹) or as a percentage (%). The loan amount is calculated automatically.',
      },
      {
        subtitle: 'Loan Amount',
        text: 'If you already know your loan amount, you can enter it directly by clicking "Enter Loan Amount Directly" — this overrides the property value / down payment calculation.',
      },
      {
        subtitle: 'Interest Rate',
        text: 'Enter your annual interest rate (e.g. 8.5 for 8.5% p.a.). Check your loan sanction letter or call your bank to confirm the current rate.',
      },
      {
        subtitle: 'Tenure',
        text: 'Enter the loan tenure in years and months. Most home loans range from 10 to 30 years. Longer tenure = lower EMI but much higher total interest.',
      },
      {
        subtitle: 'Loan Start Date',
        text: 'Select the month and year your loan disbursement starts. This is used to generate accurate amortization dates.',
      },
    ],
  },
  {
    icon: TrendingUp,
    color: 'emerald',
    title: 'Step 2: Plan Prepayments',
    id: 'prepayment',
    content: [
      {
        subtitle: 'Enable Prepayment',
        text: 'Toggle on Prepayment to see how extra payments reduce your loan. You can choose to "Reduce Tenure" (pay off early, same EMI) or "Reduce EMI" (lower monthly payment, same end date).',
      },
      {
        subtitle: 'Monthly Extra',
        text: 'A fixed extra amount you pay every month on top of your EMI. For example, ₹5,000/month from a specific start date.',
      },
      {
        subtitle: 'One-Time Payment',
        text: 'A single lump sum payment made once at the start date you choose.',
      },
      {
        subtitle: 'Yearly Payment',
        text: 'An amount you pay once every year (e.g. using your annual bonus). Applied on the same month each year.',
      },
      {
        subtitle: 'Add Lump Sum Payments',
        text: 'Click "+ Add Payment" to add specific payments on specific dates — for example ₹2 lakh in March 2027 and ₹3 lakh in December 2028. This is the most flexible option for real-world planning.',
      },
    ],
  },
  {
    icon: ArrowUpCircle,
    color: 'amber',
    title: 'Step 3: Use EMI Booster',
    id: 'emi-booster',
    content: [
      {
        subtitle: 'What is EMI Booster?',
        text: 'EMI Booster lets you voluntarily increase your monthly EMI from a specific date — for example, after a salary hike. Instead of the calculated ₹43,391, you commit to ₹50,000/month.',
      },
      {
        subtitle: 'Setting the Boost',
        text: 'Use the slider or input field to set your boosted EMI amount. Set the "Boost Start" month and year to match when you want it to begin.',
      },
      {
        subtitle: 'Viewing the Impact',
        text: 'After clicking Calculate, the "EMI Booster" tab in the amortization table shows your schedule with the boosted EMI. If you also have prepayments active, the "Combined" tab shows the combined effect.',
      },
    ],
  },
  {
    icon: Building2,
    color: 'purple',
    title: 'Step 4: Top-Up Loan',
    id: 'topup',
    content: [
      {
        subtitle: 'What is a Top-Up Loan?',
        text: 'A top-up loan is an additional loan taken on top of your existing home loan — typically for renovation, repairs, or other needs. It usually has a slightly higher interest rate.',
      },
      {
        subtitle: 'How to Use It',
        text: 'Enable the Top-Up section, enter the top-up amount, interest rate, and tenure. You can also set a start date if the top-up begins later than your main loan.',
      },
      {
        subtitle: 'What You See',
        text: 'The calculator shows your top-up EMI, total interest on the top-up, combined monthly outflow (main EMI + top-up EMI), and a separate amortization table for the top-up.',
      },
    ],
  },
  {
    icon: BarChart3,
    color: 'rose',
    title: 'Step 5: Read the Results',
    id: 'results',
    content: [
      {
        subtitle: 'Summary Cards',
        text: 'After clicking Calculate, you see key metrics: Monthly EMI, Total Interest, Total Payment, Loan End Date, and (if prepayment is active) how many months and rupees you save.',
      },
      {
        subtitle: 'Amortization Table Tabs',
        text: 'The table has up to 5 tabs: Base (your standard schedule), Prepayment, EMI Booster, Combined (booster + prepayment), and Top-Up. Each tab shows month-by-month breakdown of EMI, principal, interest, and balance.',
      },
      {
        subtitle: 'Charts',
        text: 'The charts show your principal vs interest breakdown over time, and how your outstanding balance reduces each year.',
      },
    ],
  },
];

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
  purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
  rose: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400',
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 dark:text-gray-200">How to Use</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          How to Use the Home Loan Calculator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base mb-10 max-w-2xl">
          A complete walkthrough of every feature — from entering loan details to reading your amortization schedule and modelling prepayment strategies.
        </p>

        {/* Quick jump */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 mb-10">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Jump to</p>
          <div className="flex flex-wrap gap-2">
            {steps.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-10">
          {steps.map((step) => {
            const Icon = step.icon;
            const iconCls = colorMap[step.color];
            return (
              <section
                key={step.id}
                id={step.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 scroll-mt-20"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`p-2.5 rounded-xl ${iconCls}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h2>
                </div>
                <div className="space-y-5">
                  {step.content.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <CheckCircle className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{item.subtitle}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Ready to Calculate?</h3>
          <p className="text-indigo-200 text-sm mb-5">Use the calculator to model your exact loan scenario.</p>
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
