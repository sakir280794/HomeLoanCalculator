'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { Calculator } from 'lucide-react';

const inputCls = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function CAGRCalculator() {
  const [mode, setMode] = useState<'cagr' | 'fv'>('cagr');
  const [initialValue, setInitialValue] = useState('100000');
  const [finalValue, setFinalValue] = useState('200000');
  const [cagrInput, setCagrInput] = useState('12');
  const [years, setYears] = useState('5');
  const [result, setResult] = useState<{ cagr?: number; fv?: number; absoluteReturn: number; totalGain: number } | null>(null);

  function calculate() {
    const iv = parseFloat(initialValue) || 0;
    const n = parseFloat(years) || 1;
    if (mode === 'cagr') {
      const fv = parseFloat(finalValue) || 0;
      if (iv <= 0 || fv <= 0 || n <= 0) return;
      const cagr = (Math.pow(fv / iv, 1 / n) - 1) * 100;
      const absoluteReturn = ((fv - iv) / iv) * 100;
      setResult({ cagr, absoluteReturn, totalGain: fv - iv, fv });
    } else {
      const cagr = parseFloat(cagrInput) / 100;
      if (iv <= 0 || cagr <= 0 || n <= 0) return;
      const fv = iv * Math.pow(1 + cagr, n);
      const absoluteReturn = ((fv - iv) / iv) * 100;
      setResult({ fv, absoluteReturn, totalGain: fv - iv });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📈</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">CAGR Calculator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Compound Annual Growth Rate — calculate or apply CAGR</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-5 lg:sticky lg:top-24">
            {/* Mode selector */}
            <div className="grid grid-cols-2 gap-2">
              {[{ label: 'Find CAGR', value: 'cagr' }, { label: 'Find Future Value', value: 'fv' }].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setMode(opt.value as 'cagr' | 'fv'); setResult(null); }}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${mode === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Initial Investment</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={initialValue} onChange={e => setInitialValue(e.target.value)} className={`${inputCls} pl-8`} />
              </div>
            </div>

            {mode === 'cagr' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Final Value / Maturity Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input type="number" value={finalValue} onChange={e => setFinalValue(e.target.value)} className={`${inputCls} pl-8`} />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected CAGR (%)</label>
                <div className="relative">
                  <input type="number" value={cagrInput} onChange={e => setCagrInput(e.target.value)} className={`${inputCls} pr-12`} step="0.5" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Investment Period (Years)</label>
              <div className="relative">
                <input type="number" value={years} onChange={e => setYears(e.target.value)} className={`${inputCls} pr-12`} step="0.5" min="0.5" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Yrs</span>
              </div>
            </div>

            <button onClick={calculate} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
              <Calculator className="w-5 h-5" /> Calculate
            </button>
          </div>

          <div className="space-y-5">
            {result ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {mode === 'cagr' && result.cagr !== undefined && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-5 text-center">
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">CAGR</p>
                      <p className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">{result.cagr.toFixed(2)}%</p>
                      <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">per year</p>
                    </div>
                  )}
                  {mode === 'fv' && result.fv !== undefined && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-5 text-center">
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">Future Value</p>
                      <p className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300">{fmt(result.fv)}</p>
                    </div>
                  )}
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-5 text-center">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">Total Gain</p>
                    <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{fmt(result.totalGain)}</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-5 text-center">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">Absolute Return</p>
                    <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">{result.absoluteReturn.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Benchmark comparison */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">CAGR Benchmarks</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Savings Account', cagr: 3.5 },
                      { label: 'Fixed Deposit (3 yr)', cagr: 7.0 },
                      { label: 'PPF', cagr: 7.1 },
                      { label: 'Nifty 50 (10 yr avg)', cagr: 12.5 },
                      { label: 'Your Investment', cagr: mode === 'cagr' ? (result.cagr ?? 0) : parseFloat(cagrInput), highlight: true },
                    ].map(b => (
                      <div key={b.label} className={`flex items-center gap-3 ${b.highlight ? 'font-bold' : ''}`}>
                        <span className={`text-xs w-36 shrink-0 ${b.highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'}`}>{b.label}</span>
                        <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                          <div className={`h-full rounded-full ${b.highlight ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-slate-600'}`} style={{ width: `${Math.min(100, (b.cagr / 20) * 100)}%` }} />
                        </div>
                        <span className={`text-xs w-12 text-right ${b.highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>{b.cagr.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <span className="text-5xl mb-4">📈</span>
                <p className="text-base font-semibold text-gray-400 dark:text-slate-500">Select mode and click Calculate</p>
                <p className="text-sm text-gray-300 dark:text-slate-600 mt-1">Find CAGR or project future value of any investment</p>
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
