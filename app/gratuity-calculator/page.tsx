'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { Calculator } from 'lucide-react';

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
const inputCls = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';

export default function GratuityCalculatorPage() {
  const [salary, setSalary] = useState('50000');
  const [years, setYears] = useState('10');
  const [covered, setCovered] = useState(true);
  const [result, setResult] = useState<{ gratuity: number } | null>(null);

  const calculate = () => {
    const s = parseFloat(salary);
    const y = parseFloat(years);
    if (!s || !y || s <= 0 || y <= 0) return;
    // Gratuity Act: (15/26) * last salary * years (for covered establishments)
    // Non-covered: (15/30) * last salary * years
    const gratuity = covered
      ? (15 / 26) * s * y
      : (15 / 30) * s * y;
    setResult({ gratuity });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🤝</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gratuity Calculator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Calculate gratuity as per the Payment of Gratuity Act, 1972</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-5 lg:sticky lg:top-24">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Drawn Monthly Basic + DA</label>
              <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className={`${inputCls} pl-8`} /></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Years of Service</label>
              <div className="relative"><input type="number" value={years} onChange={e => setYears(e.target.value)} className={`${inputCls} pr-12`} step="0.5" min="5" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Yrs</span></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Organisation Type</label>
              <div className="grid grid-cols-1 gap-2">
                {[[true, 'Covered (10+ employees — Gratuity Act applies)'], [false, 'Not Covered (fewer employees)']].map(([v, l]) => (
                  <button key={String(v)} onClick={() => setCovered(v as boolean)} className={`py-2.5 px-3 rounded-xl text-sm font-medium text-left transition-colors ${covered === v ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'}`}>{l as string}</button>
                ))}
              </div>
            </div>
            <button onClick={calculate} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
              <Calculator className="w-5 h-5" />Calculate Gratuity
            </button>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
              <p>Formula (Covered): <strong>(15/26) × Last Salary × Years</strong></p>
              <p>Min service required: 5 years. Max tax-exempt: ₹20 lakh.</p>
            </div>
          </div>
          <div>
            {result ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-2">Gratuity Amount</p>
                  <p className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-300">{fmt(result.gratuity)}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 space-y-3 text-sm">
                  {[
                    { label: 'Last Salary (Basic + DA)', value: fmt(parseFloat(salary)) },
                    { label: 'Years of Service', value: `${years} years` },
                    { label: 'Formula Used', value: covered ? '(15/26) × Salary × Years' : '(15/30) × Salary × Years' },
                    { label: 'Gratuity Amount', value: fmt(result.gratuity) },
                    { label: 'Tax Exempt Limit', value: '₹20,00,000' },
                    { label: 'Taxable Amount', value: result.gratuity > 2000000 ? fmt(result.gratuity - 2000000) : 'Nil' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{r.label}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <span className="text-5xl mb-4">🤝</span>
                <p className="text-base font-semibold text-gray-400 dark:text-slate-500">Enter salary and service years</p>
                <p className="text-sm text-gray-300 dark:text-slate-600 mt-1">Minimum 5 years of service required for gratuity</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8"><Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← All Calculators</Link></div>
      </main>
    </div>
  );
}
