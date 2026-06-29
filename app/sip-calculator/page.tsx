'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { Calculator } from 'lucide-react';

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
const inputCls = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';

export default function SIPCalculatorPage() {
  const [monthly, setMonthly] = useState('5000');
  const [rate, setRate] = useState('12');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<{ corpus: number; invested: number; gains: number } | null>(null);

  const calculate = () => {
    const m = parseFloat(monthly);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (!m || !r || !n || m <= 0 || n <= 0) return;
    const corpus = m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = m * n;
    setResult({ corpus, invested, gains: corpus - invested });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📊</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">SIP Calculator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Estimate the future value of your Systematic Investment Plan</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-5 lg:sticky lg:top-24">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Monthly SIP Amount</label>
              <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className={`${inputCls} pl-8`} placeholder="5000" /></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected Annual Return</label>
              <div className="relative"><input type="number" value={rate} onChange={e => setRate(e.target.value)} className={`${inputCls} pr-12`} placeholder="12" step="0.5" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">% p.a.</span></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Investment Period</label>
              <div className="relative"><input type="number" value={years} onChange={e => setYears(e.target.value)} className={`${inputCls} pr-12`} placeholder="10" min="1" max="40" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Yrs</span></div>
            </div>
            <button onClick={calculate} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
              <Calculator className="w-5 h-5" />Calculate Returns
            </button>
          </div>
          <div className="space-y-5">
            {result ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Corpus', value: fmt(result.corpus), color: 'emerald' },
                    { label: 'Total Invested', value: fmt(result.invested), color: 'indigo' },
                    { label: 'Total Gains', value: fmt(result.gains), color: 'amber' },
                  ].map(c => (
                    <div key={c.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 text-center">
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{c.label}</p>
                      <p className={`text-xl font-bold ${c.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : c.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}`}>{c.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 space-y-3">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Breakdown</h3>
                  {[
                    { label: 'Monthly SIP', value: fmt(parseFloat(monthly)) },
                    { label: 'Investment Period', value: `${years} years (${parseFloat(years) * 12} months)` },
                    { label: 'Total Invested', value: fmt(result.invested) },
                    { label: 'Estimated Returns', value: fmt(result.gains) },
                    { label: 'Final Corpus', value: fmt(result.corpus) },
                    { label: 'Wealth Gained', value: `${((result.gains / result.invested) * 100).toFixed(1)}%` },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{r.label}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{r.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
                  <p className="text-xs text-amber-700 dark:text-amber-300">Returns shown are estimates based on a fixed annual return rate. Mutual fund returns vary and are not guaranteed. Past performance is not indicative of future results.</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <span className="text-5xl mb-4">📊</span>
                <p className="text-base font-semibold text-gray-400 dark:text-slate-500">Enter SIP details and calculate</p>
                <p className="text-sm text-gray-300 dark:text-slate-600 mt-1">Total corpus, invested amount and gains</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8"><Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← All Calculators</Link></div>
      </main>
    </div>
  );
}
