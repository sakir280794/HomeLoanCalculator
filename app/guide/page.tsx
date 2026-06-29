import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { ChevronRight, Calculator, TrendingUp, PiggyBank, Receipt, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Use FinCalc India — Guide for All Calculators',
  description: 'Step-by-step guide for all FinCalc India calculators — loan EMI, prepayment, FD, SIP, PPF, GST, gratuity, compound interest and more.',
};

const sections = [
  {
    icon: Calculator,
    color: 'indigo',
    title: 'Loan Calculators',
    id: 'loans',
    subtitle: 'Home Loan, Personal Loan, Car Loan, Bike Loan, Education Loan, Business Loan, EMI Calculator',
    content: [
      {
        subtitle: 'Enter Your Loan Details',
        text: 'Fill in the Loan Amount (₹), Annual Interest Rate (% p.a.), and Tenure (years). The calculator instantly shows your monthly EMI, total interest payable, and total repayment amount.',
      },
      {
        subtitle: 'Read the Results',
        text: 'After clicking Calculate you get: Monthly EMI, Total Interest, Total Payment, and an amortization table showing month-by-month principal/interest/balance breakdown. Navigate pages with the arrows below the table.',
      },
      {
        subtitle: 'Home Loan — Prepayment Planner',
        text: 'The Home Loan calculator has an advanced Prepayment section. Toggle it on and choose "Reduce Tenure" (pay off early, same EMI) or "Reduce EMI" (lower monthly payment). Add monthly extra, one-time lump sum, yearly payments, or multiple custom payments on specific dates.',
      },
      {
        subtitle: 'Home Loan — EMI Booster',
        text: 'EMI Booster lets you commit to a higher EMI from a future date (e.g. after a salary hike). Set the boosted amount and start month — the calculator shows exactly how many months and rupees you save.',
      },
      {
        subtitle: 'Home Loan — Top-Up Loan',
        text: 'Planning a home renovation loan on top of your existing home loan? Enable Top-Up, enter its amount, rate, and tenure. The calculator shows the combined monthly outflow and a separate amortization table for the top-up.',
      },
      {
        subtitle: 'Typical Interest Rates (India, 2026)',
        text: 'Home Loan: 8–9.5% · Personal Loan: 10–18% · Car Loan: 8–11% · Bike Loan: 9–13% · Education Loan: 9–12% · Business Loan: 12–18%. Always confirm your exact rate with your lender.',
      },
    ],
  },
  {
    icon: TrendingUp,
    color: 'emerald',
    title: 'Investment Calculators',
    id: 'investments',
    subtitle: 'SIP, FD, PPF, Lumpsum Investment',
    content: [
      {
        subtitle: 'SIP Calculator — Systematic Investment Plan',
        text: 'Enter your Monthly SIP Amount (₹), Expected Annual Return (%), and Investment Period (years). The calculator shows Total Corpus (future value), Total Invested, and Total Gains using the SIP future value formula: M × ((1+r)^n − 1)/r × (1+r).',
      },
      {
        subtitle: 'FD Calculator — Fixed Deposit',
        text: 'Enter Principal, Annual Interest Rate, FD Tenure, and choose Compounding Frequency (Monthly, Quarterly, Half-Yearly, Yearly). Most Indian banks compound quarterly. The result shows Maturity Amount, Interest Earned, and Effective Annual Rate.',
      },
      {
        subtitle: 'PPF Calculator — Public Provident Fund',
        text: 'Enter your Yearly Deposit (max ₹1,50,000), interest rate (currently 7.1% p.a.), and tenure (minimum 15 years). PPF compounds annually and interest is fully tax-free under Section 80C. The calculator simulates the year-by-year accumulation.',
      },
      {
        subtitle: 'Lumpsum Calculator',
        text: 'For a one-time mutual fund or equity investment. Enter the Investment Amount, Expected Annual Return, and Period. Uses the compound interest formula A = P × (1+r)^t. Compare this with SIP to decide which works better for your financial situation.',
      },
      {
        subtitle: 'Important Disclaimer',
        text: 'SIP and Lumpsum returns are estimates based on a fixed assumed rate. Mutual fund returns are market-linked and not guaranteed. FD and PPF returns are more predictable but still subject to rate revisions by your bank/government.',
      },
    ],
  },
  {
    icon: PiggyBank,
    color: 'amber',
    title: 'Interest Calculators',
    id: 'interest',
    subtitle: 'Compound Interest, Simple Interest',
    content: [
      {
        subtitle: 'Simple Interest',
        text: 'Formula: SI = P × R × T. Enter Principal (P), Rate per annum (R%), and Time in years (T). Used for short-term loans, friendly lending, and basic financial math. The result shows interest earned and total amount (A = P + SI).',
      },
      {
        subtitle: 'Compound Interest',
        text: 'Formula: A = P × (1 + r/n)^(nt). Choose Compounding Frequency — Annual, Half-Yearly, Quarterly, Monthly, or Daily. More frequent compounding = slightly higher returns. The calculator shows the effective formula with your actual numbers substituted in.',
      },
      {
        subtitle: 'When to Use Which',
        text: 'Simple Interest: quick estimates, cheque discounting, peer lending. Compound Interest: savings accounts, FDs, investment growth modelling. Most real-world financial products use compound interest — understanding both helps you evaluate deals accurately.',
      },
    ],
  },
  {
    icon: Receipt,
    color: 'rose',
    title: 'Tax & Utility Calculators',
    id: 'tax',
    subtitle: 'GST Calculator, Gratuity Calculator',
    content: [
      {
        subtitle: 'GST Calculator — Exclusive vs Inclusive',
        text: 'Choose whether your amount is Exclusive (before GST) or Inclusive (GST already included). Select GST rate using the quick buttons (3%, 5%, 12%, 18%, 28%) or enter a custom rate. The result shows Pre-GST Amount, Total GST, CGST (Central), SGST (State), and Final Amount.',
      },
      {
        subtitle: 'GST Rate Reference',
        text: '5%: essential food, transport, economy hotels · 12%: processed food, mobile phones · 18%: most services, electronics, restaurants · 28%: luxury goods, cars, tobacco, aerated drinks.',
      },
      {
        subtitle: 'Gratuity Calculator',
        text: 'As per the Payment of Gratuity Act, 1972. Enter Last Drawn Monthly Basic + DA, Years of Service (minimum 5 years to be eligible), and select whether your organisation is Covered (10+ employees) or Not Covered. Formula: (15/26) × Last Salary × Years for covered establishments.',
      },
      {
        subtitle: 'Gratuity Tax Rules',
        text: 'Gratuity up to ₹20 lakh is fully exempt from income tax for employees covered under the Gratuity Act. The calculator shows the taxable amount if your gratuity exceeds this limit. Always verify with a tax advisor for your specific situation.',
      },
    ],
  },
];

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
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
          How to Use FinCalc India
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base mb-10 max-w-2xl">
          A complete guide to every calculator — loans, investments, interest, tax and more. Find your calculator type below and follow the steps.
        </p>

        {/* Quick jump */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 mb-10">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Jump to section</p>
          <div className="flex flex-wrap gap-2">
            {sections.map(s => (
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

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => {
            const Icon = section.icon;
            const iconCls = colorMap[section.color];
            return (
              <section
                key={section.id}
                id={section.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 scroll-mt-20"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className={`p-2.5 rounded-xl shrink-0 ${iconCls}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{section.title}</h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{section.subtitle}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-5">
                  {section.content.map((item, i) => (
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
          <p className="text-indigo-200 text-sm mb-5">Pick any calculator from our full library.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            View All Calculators
          </Link>
        </div>
      </main>
    </div>
  );
}
