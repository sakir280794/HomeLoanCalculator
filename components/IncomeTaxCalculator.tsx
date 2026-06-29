'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { Calculator } from 'lucide-react';

const inputCls = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function calcNewRegimeTax(taxableIncome: number): number {
  // FY 2025-26 New Regime slabs
  const slabs = [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 0.05 },
    { limit: 1200000, rate: 0.10 },
    { limit: 1600000, rate: 0.15 },
    { limit: 2000000, rate: 0.20 },
    { limit: 2400000, rate: 0.25 },
    { limit: Infinity, rate: 0.30 },
  ];
  if (taxableIncome <= 0) return 0;
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (taxableIncome <= prev) break;
    const slice = Math.min(taxableIncome, slab.limit) - prev;
    tax += slice * slab.rate;
    prev = slab.limit;
  }
  // Rebate u/s 87A: no tax if taxable income ≤ 12,00,000
  if (taxableIncome <= 1200000) tax = 0;
  // 4% cess
  return Math.round(tax * 1.04);
}

function calcOldRegimeTax(taxableIncome: number): number {
  // Old Regime slabs
  if (taxableIncome <= 0) return 0;
  let tax = 0;
  if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;
  if (taxableIncome > 500000) tax += (Math.min(taxableIncome, 1000000) - 500000) * 0.20;
  if (taxableIncome > 250000) tax += (Math.min(taxableIncome, 500000) - 250000) * 0.05;
  // Rebate u/s 87A: no tax if taxable income ≤ 5,00,000
  if (taxableIncome <= 500000) tax = 0;
  return Math.round(tax * 1.04);
}

interface Result {
  newTaxable: number;
  newTax: number;
  oldTaxable: number;
  oldTax: number;
  savings: number;
  betterRegime: 'new' | 'old' | 'same';
}

export default function IncomeTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState('1200000');
  const [deduction80C, setDeduction80C] = useState('150000');
  const [deduction80D, setDeduction80D] = useState('25000');
  const [hraExemption, setHraExemption] = useState('0');
  const [otherDeductions, setOtherDeductions] = useState('0');
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const gross = parseFloat(grossIncome) || 0;

    // New regime: only std deduction of ₹75,000
    const newStdDeduction = 75000;
    const newTaxable = Math.max(0, gross - newStdDeduction);
    const newTax = calcNewRegimeTax(newTaxable);

    // Old regime: std deduction ₹50,000 + 80C + 80D + HRA + other
    const oldStdDeduction = 50000;
    const total80C = Math.min(parseFloat(deduction80C) || 0, 150000);
    const total80D = Math.min(parseFloat(deduction80D) || 0, 25000);
    const hra = parseFloat(hraExemption) || 0;
    const other = parseFloat(otherDeductions) || 0;
    const oldTaxable = Math.max(0, gross - oldStdDeduction - total80C - total80D - hra - other);
    const oldTax = calcOldRegimeTax(oldTaxable);

    const savings = Math.abs(newTax - oldTax);
    const betterRegime = newTax < oldTax ? 'new' : oldTax < newTax ? 'old' : 'same';
    setResult({ newTaxable, newTax, oldTaxable, oldTax, savings, betterRegime });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🧮</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Income Tax Calculator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">FY 2025-26 — Old Regime vs New Regime comparison</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
          {/* Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-5 lg:sticky lg:top-24">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Gross Annual Income (CTC)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                <input type="number" value={grossIncome} onChange={e => setGrossIncome(e.target.value)} className={`${inputCls} pl-8`} placeholder="1200000" />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Old Regime Deductions</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">80C (max ₹1.5L)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input type="number" value={deduction80C} onChange={e => setDeduction80C(e.target.value)} className={`${inputCls} pl-8`} placeholder="150000" max="150000" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">EPF, PPF, ELSS, LIC, home loan principal</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">80D — Health Insurance (max ₹25K)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input type="number" value={deduction80D} onChange={e => setDeduction80D(e.target.value)} className={`${inputCls} pl-8`} placeholder="25000" max="25000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">HRA Exemption</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input type="number" value={hraExemption} onChange={e => setHraExemption(e.target.value)} className={`${inputCls} pl-8`} placeholder="0" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Use our HRA calculator to find this</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Other Deductions (80E, 24b, etc.)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input type="number" value={otherDeductions} onChange={e => setOtherDeductions(e.target.value)} className={`${inputCls} pl-8`} placeholder="0" />
                  </div>
                </div>
              </div>
            </div>

            <button onClick={calculate} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
              <Calculator className="w-5 h-5" />
              Compare Tax Regimes
            </button>
          </div>

          {/* Results */}
          <div className="space-y-5">
            {result ? (
              <>
                {/* Recommendation */}
                <div className={`rounded-2xl p-6 border-2 ${result.betterRegime === 'new' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700' : result.betterRegime === 'old' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700' : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700'}`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">Recommendation</p>
                  <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
                    {result.betterRegime === 'new' ? '✅ New Tax Regime is better' : result.betterRegime === 'old' ? '✅ Old Tax Regime is better' : '⚖️ Both regimes are equal'}
                  </p>
                  {result.betterRegime !== 'same' && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      You save <span className="font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.savings)}</span> per year with the {result.betterRegime} regime
                    </p>
                  )}
                </div>

                {/* Side-by-side comparison */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'New Regime (FY 2025-26)', taxable: result.newTaxable, tax: result.newTax, better: result.betterRegime === 'new', color: 'emerald' },
                    { label: 'Old Regime', taxable: result.oldTaxable, tax: result.oldTax, better: result.betterRegime === 'old', color: 'indigo' },
                  ].map(r => (
                    <div key={r.label} className={`bg-white dark:bg-slate-800 rounded-2xl border-2 p-5 ${r.better ? 'border-emerald-400 dark:border-emerald-600' : 'border-gray-200 dark:border-slate-700'}`}>
                      {r.better && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">★ BETTER</span>}
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1 mb-3">{r.label}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400">Taxable Income</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{fmt(r.taxable)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400">Tax + 4% Cess</span>
                          <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">{fmt(r.tax)}</span>
                        </div>
                        <div className="flex justify-between text-xs border-t border-gray-100 dark:border-slate-700 pt-2 mt-2">
                          <span className="text-gray-500 dark:text-gray-400">In-hand (Monthly)</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{fmt((parseFloat(grossIncome) - r.tax) / 12)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Regime info */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">New Regime Tax Slabs (FY 2025-26)</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-slate-700/50">
                          <th className="px-3 py-2 text-left text-gray-500 font-semibold">Income Slab</th>
                          <th className="px-3 py-2 text-right text-gray-500 font-semibold">Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                        {[
                          ['Up to ₹4,00,000', '0%'],
                          ['₹4L – ₹8L', '5%'],
                          ['₹8L – ₹12L', '10%'],
                          ['₹12L – ₹16L', '15%'],
                          ['₹16L – ₹20L', '20%'],
                          ['₹20L – ₹24L', '25%'],
                          ['Above ₹24L', '30%'],
                        ].map(([slab, rate]) => (
                          <tr key={slab}>
                            <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{slab}</td>
                            <td className="px-3 py-2 text-right font-semibold text-gray-800 dark:text-gray-200">{rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">* No tax up to ₹12L income (after ₹75K std deduction) due to rebate u/s 87A. +4% health & education cess on all tax.</p>
                </div>

                <div className="flex gap-3 flex-wrap text-sm">
                  <Link href="/hra-calculator" className="text-indigo-600 dark:text-indigo-400 hover:underline">→ Calculate HRA Exemption</Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <span className="text-5xl mb-4">🧮</span>
                <p className="text-base font-semibold text-gray-400 dark:text-slate-500">Enter your income and click Compare</p>
                <p className="text-sm text-gray-300 dark:text-slate-600 mt-1">Get old vs new regime tax comparison instantly</p>
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
