'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { Calculator } from 'lucide-react';

const inputCls = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('60');
  const [lifeExpectancy, setLifeExpectancy] = useState('85');
  const [monthlyExpenses, setMonthlyExpenses] = useState('50000');
  const [inflation, setInflation] = useState('6');
  const [preReturnRate, setPreReturnRate] = useState('12');
  const [postReturnRate, setPostReturnRate] = useState('7');
  const [currentCorpus, setCurrentCorpus] = useState('500000');
  const [result, setResult] = useState<{
    monthlyExpensesAtRetirement: number;
    corpusNeeded: number;
    corpusFromSavings: number;
    shortfall: number;
    monthlySIP: number;
    yearsToRetirement: number;
    retirementYears: number;
  } | null>(null);

  function calculate() {
    const cAge = parseFloat(currentAge) || 30;
    const rAge = parseFloat(retirementAge) || 60;
    const lExp = parseFloat(lifeExpectancy) || 85;
    const yearsToRetirement = rAge - cAge;
    const retirementYears = lExp - rAge;
    if (yearsToRetirement <= 0 || retirementYears <= 0) return;

    const inflRate = (parseFloat(inflation) || 6) / 100;
    const preRate = (parseFloat(preReturnRate) || 12) / 100;
    const postRate = (parseFloat(postReturnRate) || 7) / 100;
    const monthlyExp = parseFloat(monthlyExpenses) || 50000;

    // Monthly expenses at retirement (inflation-adjusted)
    const annualExpAtRetirement = monthlyExp * 12 * Math.pow(1 + inflRate, yearsToRetirement);
    const monthlyExpAtRetirement = annualExpAtRetirement / 12;

    // Corpus needed at retirement (present value of annuity at post-retirement return)
    const r = postRate / 12;
    const n = retirementYears * 12;
    const corpusNeeded = monthlyExpAtRetirement * ((1 - Math.pow(1 + r, -n)) / r);

    // Corpus from current savings
    const corpusFromSavings = (parseFloat(currentCorpus) || 0) * Math.pow(1 + preRate, yearsToRetirement);
    const shortfall = Math.max(0, corpusNeeded - corpusFromSavings);

    // Monthly SIP
    const mr = preRate / 12;
    const mn = yearsToRetirement * 12;
    const monthlySIP = shortfall > 0 ? shortfall * mr / (Math.pow(1 + mr, mn) - 1) : 0;

    setResult({ monthlyExpensesAtRetirement: monthlyExpAtRetirement, corpusNeeded, corpusFromSavings, shortfall, monthlySIP, yearsToRetirement, retirementYears });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🌅</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Retirement Calculator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">How much corpus do you need to retire comfortably?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-5 lg:sticky lg:top-24">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Age</label>
                <input type="number" value={currentAge} onChange={e => setCurrentAge(e.target.value)} className={inputCls} min="18" max="60" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Retire At</label>
                <input type="number" value={retirementAge} onChange={e => setRetirementAge(e.target.value)} className={inputCls} min="40" max="75" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Life Exp.</label>
                <input type="number" value={lifeExpectancy} onChange={e => setLifeExpectancy(e.target.value)} className={inputCls} min="60" max="100" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Monthly Expenses Today</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={monthlyExpenses} onChange={e => setMonthlyExpenses(e.target.value)} className={`${inputCls} pl-8`} />
              </div>
              <p className="text-xs text-gray-400 mt-1">Your current monthly spending (all expenses)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Existing Retirement Savings</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={currentCorpus} onChange={e => setCurrentCorpus(e.target.value)} className={`${inputCls} pl-8`} />
              </div>
              <p className="text-xs text-gray-400 mt-1">EPF + PPF + NPS + mutual funds today</p>
            </div>

            <div className="space-y-3 border-t border-gray-100 dark:border-slate-700 pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Assumptions</p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Inflation Rate</label>
                <div className="relative"><input type="number" value={inflation} onChange={e => setInflation(e.target.value)} className={`${inputCls} pr-12`} step="0.5" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Pre-retirement Return</label>
                <div className="relative"><input type="number" value={preReturnRate} onChange={e => setPreReturnRate(e.target.value)} className={`${inputCls} pr-12`} step="0.5" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span></div>
                <p className="text-xs text-gray-400 mt-1">Equity portfolio while working</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Post-retirement Return</label>
                <div className="relative"><input type="number" value={postReturnRate} onChange={e => setPostReturnRate(e.target.value)} className={`${inputCls} pr-12`} step="0.5" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span></div>
                <p className="text-xs text-gray-400 mt-1">Conservative portfolio after retirement</p>
              </div>
            </div>

            <button onClick={calculate} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
              <Calculator className="w-5 h-5" /> Calculate Retirement Corpus
            </button>
          </div>

          <div className="space-y-5">
            {result ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl border-2 border-rose-300 dark:border-rose-700 p-5 text-center">
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mb-1">Retirement Corpus Needed</p>
                    <p className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">{fmt(result.corpusNeeded)}</p>
                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">To sustain {result.retirementYears} yrs of expenses</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 p-5 text-center">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">Monthly Expenses at Retirement</p>
                    <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{fmt(result.monthlyExpensesAtRetirement)}</p>
                    <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-1">After {inflation}% inflation for {result.yearsToRetirement} yrs</p>
                  </div>
                </div>

                {result.shortfall > 0 && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 p-6 text-center">
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Monthly SIP Required</p>
                    <p className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-300">{fmt(result.monthlySIP)}</p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">Invest {fmt(result.monthlySIP)}/month for {result.yearsToRetirement} years to retire comfortably</p>
                  </div>
                )}

                {result.shortfall === 0 && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 p-6 text-center">
                    <p className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">✅ You're on track!</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">Your current savings are enough to fund retirement without additional SIP.</p>
                  </div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Retirement Plan Summary</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Years to retirement', value: `${result.yearsToRetirement} years` },
                      { label: 'Retirement duration', value: `${result.retirementYears} years` },
                      { label: 'Corpus needed', value: fmt(result.corpusNeeded) },
                      { label: 'Existing savings will grow to', value: fmt(result.corpusFromSavings) },
                      { label: 'Additional corpus required', value: fmt(result.shortfall) },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between py-2 border-b border-gray-50 dark:border-slate-700/50">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{r.label}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 text-sm flex-wrap">
                  <Link href="/nps-calculator" className="text-indigo-600 dark:text-indigo-400 hover:underline">→ NPS Calculator</Link>
                  <Link href="/sip-calculator" className="text-indigo-600 dark:text-indigo-400 hover:underline">→ SIP Calculator</Link>
                  <Link href="/ppf-calculator" className="text-indigo-600 dark:text-indigo-400 hover:underline">→ PPF Calculator</Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <span className="text-5xl mb-4">🌅</span>
                <p className="text-base font-semibold text-gray-400 dark:text-slate-500">Enter details and click Calculate</p>
                <p className="text-sm text-gray-300 dark:text-slate-600 mt-1">Corpus needed, monthly SIP and retirement plan</p>
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
