'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { Calculator } from 'lucide-react';

const inputCls = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function calcRDMaturity(monthly: number, annualRate: number, months: number): number {
  // Each monthly deposit compounds quarterly for its remaining months
  const qRate = annualRate / 4 / 100;
  let total = 0;
  for (let m = 1; m <= months; m++) {
    const monthsLeft = months - m + 1;
    const quarters = monthsLeft / 3;
    total += monthly * Math.pow(1 + qRate, quarters);
  }
  return total;
}

export default function RDCalculator() {
  const [monthlyDeposit, setMonthlyDeposit] = useState('5000');
  const [tenure, setTenure] = useState('3');
  const [rate, setRate] = useState('7');
  const [result, setResult] = useState<{ maturity: number; invested: number; interest: number } | null>(null);

  function calculate() {
    const M = parseFloat(monthlyDeposit) || 0;
    const r = parseFloat(rate) || 0;
    const n = (parseFloat(tenure) || 0) * 12;
    if (M <= 0 || r <= 0 || n <= 0) return;

    const maturity = calcRDMaturity(M, r, n);
    const invested = M * n;
    const interest = maturity - invested;
    setResult({ maturity, invested, interest });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📅</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">RD Calculator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Recurring Deposit maturity amount and interest (quarterly compounding)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-5 lg:sticky lg:top-24">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Monthly Deposit Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={monthlyDeposit} onChange={e => setMonthlyDeposit(e.target.value)} className={`${inputCls} pl-8`} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tenure (Years)</label>
              <div className="relative">
                <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} className={`${inputCls} pr-12`} step="0.5" min="0.5" max="10" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Yrs</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Interest Rate</label>
              <div className="relative">
                <input type="number" value={rate} onChange={e => setRate(e.target.value)} className={`${inputCls} pr-12`} step="0.1" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">% p.a.</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">SBI: 6.5-7.1% · HDFC: 7-7.4% · Post Office: 6.7%</p>
            </div>
            <button onClick={calculate} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
              <Calculator className="w-5 h-5" /> Calculate RD Maturity
            </button>
          </div>

          <div className="space-y-5">
            {result ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Maturity Amount', value: fmt(result.maturity), color: 'indigo' },
                    { label: 'Total Deposited', value: fmt(result.invested), color: 'emerald' },
                    { label: 'Interest Earned', value: fmt(result.interest), color: 'amber' },
                  ].map(c => (
                    <div key={c.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 text-center">
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{c.label}</p>
                      <p className={`text-xl font-bold ${c.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : c.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>{c.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>Deposited: {fmt(result.invested)}</span>
                    <span>Interest: {fmt(result.interest)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden flex">
                    <div className="bg-emerald-500 rounded-l-full" style={{ width: `${(result.invested / result.maturity) * 100}%` }} />
                    <div className="bg-amber-400 flex-1 rounded-r-full" />
                  </div>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Principal ({((result.invested / result.maturity) * 100).toFixed(1)}%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />Interest ({((result.interest / result.maturity) * 100).toFixed(1)}%)</span>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-4 text-xs text-amber-700 dark:text-amber-400">
                  <strong>Tax Note:</strong> RD interest is taxable as per income slab. Banks deduct TDS at 10% if total interest in a branch exceeds ₹40,000 per year (₹50,000 for senior citizens).
                </div>

                <div className="flex gap-4 text-sm flex-wrap">
                  <Link href="/fd-calculator" className="text-indigo-600 dark:text-indigo-400 hover:underline">→ Compare with FD Calculator</Link>
                  <Link href="/sip-calculator" className="text-indigo-600 dark:text-indigo-400 hover:underline">→ Compare with SIP Returns</Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <span className="text-5xl mb-4">📅</span>
                <p className="text-base font-semibold text-gray-400 dark:text-slate-500">Enter details and click Calculate</p>
                <p className="text-sm text-gray-300 dark:text-slate-600 mt-1">RD maturity, interest earned and principal breakdown</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← All Calculators</Link>
        </div>
      </main>
    </div>
  );
}
