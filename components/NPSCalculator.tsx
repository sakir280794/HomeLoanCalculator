'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { Calculator } from 'lucide-react';

const inputCls = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function NPSCalculator() {
  const [monthlyContrib, setMonthlyContrib] = useState('5000');
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('60');
  const [expectedReturn, setExpectedReturn] = useState('10');
  const [annuityRate, setAnnuityRate] = useState('6');
  const [annuityPercent, setAnnuityPercent] = useState('40');
  const [result, setResult] = useState<{
    corpus: number; lumpSum: number; annuityCorpus: number; monthlyPension: number; totalInvested: number; wealthGained: number;
  } | null>(null);

  function calculate() {
    const M = parseFloat(monthlyContrib) || 0;
    const cAge = parseInt(currentAge) || 30;
    const rAge = parseInt(retirementAge) || 60;
    const r = (parseFloat(expectedReturn) || 10) / 100 / 12;
    const n = (rAge - cAge) * 12;
    const aRate = (parseFloat(annuityRate) || 6) / 100 / 12;
    const aPct = Math.max(40, parseFloat(annuityPercent) || 40) / 100;

    if (n <= 0) return;

    // Future value of SIP
    const corpus = M * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalInvested = M * n;
    const wealthGained = corpus - totalInvested;

    const annuityCorpus = corpus * aPct;
    const lumpSum = corpus * (1 - aPct);

    // Monthly pension from annuity corpus (perpetuity approximation)
    const monthlyPension = annuityCorpus * aRate;

    setResult({ corpus, lumpSum, annuityCorpus, monthlyPension, totalInvested, wealthGained });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🏛️</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">NPS Calculator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">National Pension System — corpus and monthly pension estimator</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-5 lg:sticky lg:top-24">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Monthly Contribution</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={monthlyContrib} onChange={e => setMonthlyContrib(e.target.value)} className={`${inputCls} pl-8`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Age</label>
                <input type="number" value={currentAge} onChange={e => setCurrentAge(e.target.value)} className={inputCls} min="18" max="65" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Retirement Age</label>
                <input type="number" value={retirementAge} onChange={e => setRetirementAge(e.target.value)} className={inputCls} min="40" max="70" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected Annual Return (%)</label>
              <div className="relative">
                <input type="number" value={expectedReturn} onChange={e => setExpectedReturn(e.target.value)} className={`${inputCls} pr-12`} step="0.5" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Equity NPS: ~10-12% historical average</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Annuity Rate (%)</label>
              <div className="relative">
                <input type="number" value={annuityRate} onChange={e => setAnnuityRate(e.target.value)} className={`${inputCls} pr-12`} step="0.5" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Current annuity rates: 5-7% per year</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Annuity Purchase % (min 40%)</label>
              <div className="relative">
                <input type="number" value={annuityPercent} onChange={e => setAnnuityPercent(e.target.value)} className={`${inputCls} pr-12`} min="40" max="100" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
              </div>
            </div>
            <button onClick={calculate} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
              <Calculator className="w-5 h-5" /> Calculate NPS Corpus
            </button>
          </div>

          <div className="space-y-5">
            {result ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Total NPS Corpus', value: fmt(result.corpus), color: 'indigo', sub: `${(parseInt(retirementAge) || 60) - (parseInt(currentAge) || 30)} yrs of growth` },
                    { label: 'Lump Sum (Tax-free)', value: fmt(result.lumpSum), color: 'emerald', sub: `${100 - Math.max(40, parseFloat(annuityPercent) || 40)}% of corpus` },
                    { label: 'Monthly Pension', value: fmt(result.monthlyPension), color: 'amber', sub: `At ${annuityRate}% annuity rate` },
                  ].map(c => (
                    <div key={c.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 text-center">
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{c.label}</p>
                      <p className={`text-xl font-bold ${c.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : c.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>{c.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">Corpus Breakdown</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Total Invested', value: result.totalInvested, color: 'indigo' },
                      { label: 'Wealth Gained', value: result.wealthGained, color: 'emerald' },
                      { label: 'Annuity Corpus', value: result.annuityCorpus, color: 'amber' },
                      { label: 'Lump Sum (60% tax-free)', value: result.lumpSum, color: 'teal' },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-700/50">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{r.label}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{fmt(r.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4 text-xs text-blue-700 dark:text-blue-400">
                  <strong>Tax Benefits:</strong> NPS contributions up to ₹1.5L under 80C + additional ₹50,000 under 80CCD(1B) — total ₹2L tax deduction. 60% lump sum withdrawal at retirement is tax-free.
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <span className="text-5xl mb-4">🏛️</span>
                <p className="text-base font-semibold text-gray-400 dark:text-slate-500">Enter details and click Calculate</p>
                <p className="text-sm text-gray-300 dark:text-slate-600 mt-1">NPS corpus, lump sum and monthly pension estimate</p>
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
