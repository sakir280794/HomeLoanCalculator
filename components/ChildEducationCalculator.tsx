'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { Calculator } from 'lucide-react';

const inputCls = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function ChildEducationCalculator() {
  const [childAge, setChildAge] = useState('5');
  const [targetAge, setTargetAge] = useState('18');
  const [currentCost, setCurrentCost] = useState('2000000');
  const [educationInflation, setEducationInflation] = useState('8');
  const [currentSavings, setCurrentSavings] = useState('100000');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [result, setResult] = useState<{
    futureCost: number; corpusFromSavings: number; shortfall: number; monthlySIP: number; yearsLeft: number;
  } | null>(null);

  function calculate() {
    const cAge = parseFloat(childAge) || 5;
    const tAge = parseFloat(targetAge) || 18;
    const n = tAge - cAge;
    if (n <= 0) return;

    const inflationRate = (parseFloat(educationInflation) || 8) / 100;
    const returnRate = (parseFloat(expectedReturn) || 12) / 100 / 12;
    const months = n * 12;

    const futureCost = (parseFloat(currentCost) || 0) * Math.pow(1 + inflationRate, n);
    const corpusFromSavings = (parseFloat(currentSavings) || 0) * Math.pow(1 + returnRate * 12, n);
    const shortfall = Math.max(0, futureCost - corpusFromSavings);

    // Monthly SIP needed to cover shortfall
    let monthlySIP = 0;
    if (shortfall > 0 && months > 0) {
      monthlySIP = shortfall * returnRate / (Math.pow(1 + returnRate, months) - 1);
    }

    setResult({ futureCost, corpusFromSavings, shortfall, monthlySIP, yearsLeft: n });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🎓</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Child Education Calculator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Plan the corpus needed for your child's higher education</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-5 lg:sticky lg:top-24">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Child's Current Age</label>
                <input type="number" value={childAge} onChange={e => setChildAge(e.target.value)} className={inputCls} min="0" max="17" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Age at Education</label>
                <input type="number" value={targetAge} onChange={e => setTargetAge(e.target.value)} className={inputCls} min="5" max="25" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Cost of Education</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={currentCost} onChange={e => setCurrentCost(e.target.value)} className={`${inputCls} pl-8`} />
              </div>
              <p className="text-xs text-gray-400 mt-1">Total cost today (e.g., IIT 4-yr ≈ ₹8-10L, Private MBA ≈ ₹20-25L)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Education Inflation Rate</label>
              <div className="relative">
                <input type="number" value={educationInflation} onChange={e => setEducationInflation(e.target.value)} className={`${inputCls} pr-12`} step="0.5" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">% p.a.</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Education inflation in India: 8-10% per year</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Savings for Education</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={currentSavings} onChange={e => setCurrentSavings(e.target.value)} className={`${inputCls} pl-8`} placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected Investment Return</label>
              <div className="relative">
                <input type="number" value={expectedReturn} onChange={e => setExpectedReturn(e.target.value)} className={`${inputCls} pr-12`} step="0.5" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">% p.a.</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Equity mutual fund: ~12% · Debt fund: ~7%</p>
            </div>

            <button onClick={calculate} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
              <Calculator className="w-5 h-5" /> Calculate Education Corpus
            </button>
          </div>

          <div className="space-y-5">
            {result ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl border-2 border-rose-300 dark:border-rose-700 p-5 text-center">
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mb-1">Future Cost of Education</p>
                    <p className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">{fmt(result.futureCost)}</p>
                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">In {result.yearsLeft} years at {educationInflation}% inflation</p>
                  </div>
                  <div className={`rounded-2xl border-2 p-5 text-center ${result.shortfall > 0 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700'}`}>
                    <p className={`text-xs font-semibold mb-1 ${result.shortfall > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {result.shortfall > 0 ? 'Shortfall' : 'You\'re on Track!'}
                    </p>
                    <p className={`text-2xl font-extrabold ${result.shortfall > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                      {result.shortfall > 0 ? fmt(result.shortfall) : '✓ Covered'}
                    </p>
                  </div>
                </div>

                {result.shortfall > 0 && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 p-6 text-center">
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Monthly SIP Required</p>
                    <p className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-300">{fmt(result.monthlySIP)}</p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">Start a SIP of {fmt(result.monthlySIP)}/month today to build the required corpus in {result.yearsLeft} years</p>
                  </div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Corpus Breakdown</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Future Cost Required', value: result.futureCost },
                      { label: 'Current Savings will grow to', value: result.corpusFromSavings },
                      { label: 'Gap to be filled by SIP', value: result.shortfall },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between py-2 border-b border-gray-50 dark:border-slate-700/50">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{r.label}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{fmt(r.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 text-sm flex-wrap">
                  <Link href="/sip-calculator" className="text-indigo-600 dark:text-indigo-400 hover:underline">→ SIP Calculator</Link>
                  <Link href="/ppf-calculator" className="text-indigo-600 dark:text-indigo-400 hover:underline">→ PPF Calculator (Tax-free)</Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <span className="text-5xl mb-4">🎓</span>
                <p className="text-base font-semibold text-gray-400 dark:text-slate-500">Enter details and click Calculate</p>
                <p className="text-sm text-gray-300 dark:text-slate-600 mt-1">Future education cost, shortfall and monthly SIP needed</p>
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
