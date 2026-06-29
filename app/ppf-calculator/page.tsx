'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { Calculator } from 'lucide-react';

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
const inputCls = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';

export default function PPFCalculatorPage() {
  const [yearly, setYearly] = useState('150000');
  const [rate, setRate] = useState('7.1');
  const [years, setYears] = useState('15');
  const [result, setResult] = useState<{ maturity: number; invested: number; interest: number } | null>(null);

  const calculate = () => {
    const y = parseFloat(yearly);
    const r = parseFloat(rate) / 100;
    const n = parseInt(years);
    if (!y || !r || !n || y <= 0 || n <= 0) return;
    if (y > 150000) { alert('PPF annual deposit limit is ₹1,50,000'); return; }
    let maturity = 0;
    for (let i = 1; i <= n; i++) {
      maturity = (maturity + y) * (1 + r);
    }
    const invested = y * n;
    setResult({ maturity, invested, interest: maturity - invested });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🏦</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">PPF Calculator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Public Provident Fund maturity and interest calculator</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-5 lg:sticky lg:top-24">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Yearly Deposit (max ₹1,50,000)</label>
              <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                <input type="number" value={yearly} onChange={e => setYearly(e.target.value)} className={`${inputCls} pl-8`} max="150000" /></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">PPF Interest Rate (current: 7.1%)</label>
              <div className="relative"><input type="number" value={rate} onChange={e => setRate(e.target.value)} className={`${inputCls} pr-12`} step="0.1" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">% p.a.</span></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tenure (min 15 years)</label>
              <div className="relative"><input type="number" value={years} onChange={e => setYears(e.target.value)} className={`${inputCls} pr-12`} min="15" max="50" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Yrs</span></div>
            </div>
            <button onClick={calculate} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
              <Calculator className="w-5 h-5" />Calculate Maturity
            </button>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 text-xs text-indigo-700 dark:text-indigo-300">
              PPF interest is tax-free. Annual deposit limit: ₹500 – ₹1,50,000. Lock-in: 15 years (extendable in 5-year blocks).
            </div>
          </div>
          <div>
            {result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Maturity Amount', value: fmt(result.maturity), color: 'emerald' },
                    { label: 'Total Invested', value: fmt(result.invested), color: 'indigo' },
                    { label: 'Interest Earned', value: fmt(result.interest), color: 'amber' },
                  ].map(c => (
                    <div key={c.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 text-center">
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{c.label}</p>
                      <p className={`text-xl font-bold ${c.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : c.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}`}>{c.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 space-y-3">
                  {[{ label: 'Yearly Deposit', value: fmt(parseFloat(yearly)) }, { label: 'Tenure', value: `${years} years` }, { label: 'Total Invested', value: fmt(result.invested) }, { label: 'Tax-free Interest', value: fmt(result.interest) }, { label: 'Maturity Value', value: fmt(result.maturity) }].map(r => (
                    <div key={r.label} className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{r.label}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <span className="text-5xl mb-4">🏦</span>
                <p className="text-base font-semibold text-gray-400 dark:text-slate-500">Enter PPF details and calculate</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8"><Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← All Calculators</Link></div>
      </main>
    </div>
  );
}
