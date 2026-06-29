'use client';

import { useState, useCallback } from 'react';
import { Calculator, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { calculateEMI } from '@/lib/calculations';

interface Row { month: number; emi: number; principal: number; interest: number; balance: number; }

function buildSchedule(principal: number, annualRate: number, months: number): Row[] {
  const emi = calculateEMI(principal, annualRate, months);
  const mr = annualRate / 100 / 12;
  let bal = principal;
  const rows: Row[] = [];
  for (let i = 1; i <= months; i++) {
    const interest = bal * mr;
    const principalPaid = Math.min(emi - interest, bal);
    bal = Math.max(0, bal - principalPaid);
    rows.push({ month: i, emi, principal: principalPaid, interest, balance: bal });
  }
  return rows;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

const inputCls = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';

export interface SimpleLoanConfig {
  title: string;
  subtitle: string;
  defaultPrincipal: string;
  defaultRate: string;
  defaultYears: string;
  rateLabel?: string;
  principalLabel?: string;
  emoji: string;
}

const PAGE_SIZE = 12;

export default function SimpleLoanCalculator({ config }: { config: SimpleLoanConfig }) {
  const [principal, setPrincipal] = useState(config.defaultPrincipal);
  const [rate, setRate] = useState(config.defaultRate);
  const [years, setYears] = useState(config.defaultYears);
  const [months, setMonths] = useState('0');
  const [result, setResult] = useState<{ emi: number; totalInterest: number; totalPayment: number; schedule: Row[] } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const handleCalculate = useCallback(() => {
    const errs: Record<string, string> = {};
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const totalMonths = (parseInt(years) || 0) * 12 + (parseInt(months) || 0);
    if (!p || p <= 0) errs.principal = 'Enter a valid loan amount';
    if (!r || r <= 0 || r > 50) errs.rate = 'Enter a valid interest rate (0.1 – 50%)';
    if (totalMonths <= 0) errs.tenure = 'Tenure must be at least 1 month';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const emi = calculateEMI(p, r, totalMonths);
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - p;
    const schedule = buildSchedule(p, r, totalMonths);
    setResult({ emi, totalInterest, totalPayment, schedule });
    setPage(1);
  }, [principal, rate, years, months]);

  const totalPages = result ? Math.ceil(result.schedule.length / PAGE_SIZE) : 0;
  const pageRows = result ? result.schedule.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{config.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{config.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{config.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          {/* Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-5 lg:sticky lg:top-24">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{config.principalLabel ?? 'Loan Amount'}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className={`${inputCls} pl-8`} placeholder="500000" min="0" />
              </div>
              {errors.principal && <p className="text-xs text-red-500 mt-1">{errors.principal}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{config.rateLabel ?? 'Annual Interest Rate'}</label>
              <div className="relative">
                <input type="number" value={rate} onChange={e => setRate(e.target.value)} className={`${inputCls} pr-12`} placeholder="10.5" step="0.1" min="0" max="50" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">% p.a.</span>
              </div>
              {errors.rate && <p className="text-xs text-red-500 mt-1">{errors.rate}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Loan Tenure</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input type="number" value={years} onChange={e => setYears(e.target.value)} className={`${inputCls} pr-10`} placeholder="5" min="0" max="30" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Yrs</span>
                </div>
                <div className="relative">
                  <input type="number" value={months} onChange={e => setMonths(e.target.value)} className={`${inputCls} pr-10`} placeholder="0" min="0" max="11" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Mo</span>
                </div>
              </div>
              {errors.tenure && <p className="text-xs text-red-500 mt-1">{errors.tenure}</p>}
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <Calculator className="w-5 h-5" />
              Calculate EMI
            </button>
          </div>

          {/* Results */}
          <div className="space-y-5">
            {result ? (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Monthly EMI', value: fmt(result.emi), color: 'indigo' },
                    { label: 'Total Interest', value: fmt(result.totalInterest), color: 'rose' },
                    { label: 'Total Payment', value: fmt(result.totalPayment), color: 'emerald' },
                  ].map(c => (
                    <div key={c.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 text-center">
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{c.label}</p>
                      <p className={`text-xl font-bold ${c.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : c.color === 'rose' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{c.value}</p>
                    </div>
                  ))}
                </div>

                {/* Interest ratio bar */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>Principal: {fmt(parseFloat(principal))}</span>
                    <span>Interest: {fmt(result.totalInterest)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden flex">
                    <div
                      className="bg-indigo-500 rounded-l-full transition-all"
                      style={{ width: `${(parseFloat(principal) / result.totalPayment) * 100}%` }}
                    />
                    <div className="bg-rose-400 flex-1 rounded-r-full" />
                  </div>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />Principal</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />Interest</span>
                  </div>
                </div>

                {/* Amortization table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Amortization Schedule</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-slate-700/50">
                          <th className="px-4 py-3 text-left text-gray-500 dark:text-gray-400 font-semibold">Month</th>
                          <th className="px-4 py-3 text-right text-gray-500 dark:text-gray-400 font-semibold">EMI</th>
                          <th className="px-4 py-3 text-right text-gray-500 dark:text-gray-400 font-semibold">Principal</th>
                          <th className="px-4 py-3 text-right text-gray-500 dark:text-gray-400 font-semibold">Interest</th>
                          <th className="px-4 py-3 text-right text-gray-500 dark:text-gray-400 font-semibold">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                        {pageRows.map(row => (
                          <tr key={row.month} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">{row.month}</td>
                            <td className="px-4 py-2.5 text-right text-gray-800 dark:text-gray-200">{fmt(row.emi)}</td>
                            <td className="px-4 py-2.5 text-right text-indigo-600 dark:text-indigo-400">{fmt(row.principal)}</td>
                            <td className="px-4 py-2.5 text-right text-rose-500 dark:text-rose-400">{fmt(row.interest)}</td>
                            <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300">{fmt(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-slate-700">
                      <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
                      <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <span className="text-5xl mb-4">{config.emoji}</span>
                <p className="text-base font-semibold text-gray-400 dark:text-slate-500">Enter details and click Calculate</p>
                <p className="text-sm text-gray-300 dark:text-slate-600 mt-1">EMI, amortization schedule and interest breakdown</p>
              </div>
            )}
          </div>
        </div>

        {/* Back to all calculators */}
        <div className="mt-8">
          <Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            ← All Calculators
          </Link>
        </div>
      </main>
    </div>
  );
}
