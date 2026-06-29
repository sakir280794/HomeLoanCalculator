'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { Calculator } from 'lucide-react';

const inputCls = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function HRACalculator() {
  const [basicSalary, setBasicSalary] = useState('50000');
  const [da, setDa] = useState('0');
  const [hraReceived, setHraReceived] = useState('20000');
  const [rentPaid, setRentPaid] = useState('15000');
  const [isMetro, setIsMetro] = useState(true);
  const [result, setResult] = useState<{
    condition1: number; condition2: number; condition3: number;
    exemptHRA: number; taxableHRA: number;
  } | null>(null);

  function calculate() {
    const basic = (parseFloat(basicSalary) || 0) + (parseFloat(da) || 0);
    const hra = parseFloat(hraReceived) || 0;
    const rent = parseFloat(rentPaid) || 0;

    const condition1 = hra;
    const condition2 = basic * (isMetro ? 0.5 : 0.4);
    const condition3 = Math.max(0, rent - basic * 0.1);

    const exemptHRA = Math.min(condition1, condition2, condition3);
    const taxableHRA = Math.max(0, hra - exemptHRA);
    setResult({ condition1, condition2, condition3, exemptHRA, taxableHRA });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🏠</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">HRA Calculator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Calculate House Rent Allowance tax exemption</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-5 lg:sticky lg:top-24">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Basic Salary (Monthly)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={basicSalary} onChange={e => setBasicSalary(e.target.value)} className={`${inputCls} pl-8`} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Dearness Allowance / DA (Monthly)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={da} onChange={e => setDa(e.target.value)} className={`${inputCls} pl-8`} placeholder="0" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Usually 0 for private sector employees</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">HRA Received from Employer (Monthly)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={hraReceived} onChange={e => setHraReceived(e.target.value)} className={`${inputCls} pl-8`} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Actual Rent Paid (Monthly)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={rentPaid} onChange={e => setRentPaid(e.target.value)} className={`${inputCls} pl-8`} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ label: 'Metro (50%)', value: true }, { label: 'Non-Metro (40%)', value: false }].map(opt => (
                  <button
                    key={String(opt.value)}
                    onClick={() => setIsMetro(opt.value)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${isMetro === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:border-indigo-400'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">Metro: Delhi, Mumbai, Chennai, Kolkata</p>
            </div>
            <button onClick={calculate} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
              <Calculator className="w-5 h-5" /> Calculate HRA Exemption
            </button>
          </div>

          <div className="space-y-5">
            {result ? (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 p-5 text-center">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">Exempt HRA (per month)</p>
                    <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{fmt(result.exemptHRA)}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Annual: {fmt(result.exemptHRA * 12)}</p>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl border-2 border-rose-300 dark:border-rose-700 p-5 text-center">
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mb-1">Taxable HRA (per month)</p>
                    <p className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">{fmt(result.taxableHRA)}</p>
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">Annual: {fmt(result.taxableHRA * 12)}</p>
                  </div>
                </div>

                {/* 3 conditions breakdown */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">HRA Exemption = Minimum of 3 Conditions</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Condition 1 — Actual HRA received', value: result.condition1, desc: 'From employer per month' },
                      { label: `Condition 2 — ${isMetro ? '50%' : '40%'} of Basic + DA`, value: result.condition2, desc: isMetro ? '50% for metro cities' : '40% for non-metro cities' },
                      { label: 'Condition 3 — Rent paid minus 10% of Basic+DA', value: result.condition3, desc: 'Excess rent over 10% threshold' },
                    ].map((c, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${c.value === result.exemptHRA ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-gray-50 dark:bg-slate-700/40'}`}>
                        <div>
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{c.label}</p>
                          <p className="text-xs text-gray-400">{c.desc}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className={`text-sm font-bold ${c.value === result.exemptHRA ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>{fmt(c.value)}</p>
                          {c.value === result.exemptHRA && <p className="text-xs text-emerald-600 dark:text-emerald-400">← Minimum</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-4 text-xs text-amber-700 dark:text-amber-400">
                  <strong>Note:</strong> HRA exemption is only available under the Old Tax Regime. Under New Regime (FY 2025-26), HRA is fully taxable. Use the Income Tax Calculator to compare which regime saves you more.
                </div>

                <Link href="/income-tax" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline block">→ Compare Old vs New Tax Regime</Link>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <span className="text-5xl mb-4">🏠</span>
                <p className="text-base font-semibold text-gray-400 dark:text-slate-500">Enter details and click Calculate</p>
                <p className="text-sm text-gray-300 dark:text-slate-600 mt-1">See HRA exemption breakdown across all 3 conditions</p>
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
