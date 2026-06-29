'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { Calculator } from 'lucide-react';

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
}
const inputCls = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';

type Mode = 'exclusive' | 'inclusive';
const GST_RATES = [3, 5, 12, 18, 28];

export default function GSTCalculatorPage() {
  const [amount, setAmount] = useState('10000');
  const [gstRate, setGstRate] = useState('18');
  const [mode, setMode] = useState<Mode>('exclusive');
  const [result, setResult] = useState<{ gst: number; pre: number; post: number; cgst: number; sgst: number } | null>(null);

  const calculate = () => {
    const a = parseFloat(amount);
    const r = parseFloat(gstRate) / 100;
    if (!a || a <= 0 || !r) return;
    let pre: number, gst: number;
    if (mode === 'exclusive') {
      pre = a; gst = a * r;
    } else {
      pre = a / (1 + r); gst = a - pre;
    }
    setResult({ gst, pre, post: pre + gst, cgst: gst / 2, sgst: gst / 2 });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📋</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">GST Calculator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Calculate GST, CGST, SGST on any amount — exclusive or inclusive</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-5 lg:sticky lg:top-24">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Amount</label>
              <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className={`${inputCls} pl-8`} /></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">GST Rate</label>
              <div className="grid grid-cols-5 gap-1.5 mb-2">
                {GST_RATES.map(r => (
                  <button key={r} onClick={() => setGstRate(String(r))} className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${gstRate === String(r) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'}`}>{r}%</button>
                ))}
              </div>
              <div className="relative"><input type="number" value={gstRate} onChange={e => setGstRate(e.target.value)} className={`${inputCls} pr-8`} step="0.5" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Amount Type</label>
              <div className="grid grid-cols-2 gap-2">
                {([['exclusive', 'Excl. GST'], ['inclusive', 'Incl. GST']] as [Mode, string][]).map(([v, l]) => (
                  <button key={v} onClick={() => setMode(v)} className={`py-2 rounded-xl text-sm font-medium transition-colors ${mode === v ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'}`}>{l}</button>
                ))}
              </div>
            </div>
            <button onClick={calculate} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
              <Calculator className="w-5 h-5" />Calculate GST
            </button>
          </div>
          <div>
            {result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Pre-GST Amount', value: fmt(result.pre), color: 'indigo' },
                    { label: `GST (${gstRate}%)`, value: fmt(result.gst), color: 'rose' },
                    { label: 'CGST', value: fmt(result.cgst), color: 'amber' },
                    { label: 'SGST', value: fmt(result.sgst), color: 'amber' },
                  ].map(c => (
                    <div key={c.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-4 text-center">
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{c.label}</p>
                      <p className={`text-lg font-bold ${c.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : c.color === 'rose' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>{c.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-emerald-800 dark:text-emerald-200">Total (Inc. GST)</span>
                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{fmt(result.post)}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 space-y-2 text-sm">
                  {[{ l: 'Base Amount', v: fmt(result.pre) }, { l: 'CGST (Central)', v: fmt(result.cgst) }, { l: 'SGST (State)', v: fmt(result.sgst) }, { l: 'Total GST', v: fmt(result.gst) }, { l: 'Final Amount', v: fmt(result.post) }].map(r => (
                    <div key={r.l} className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{r.l}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <span className="text-5xl mb-4">📋</span>
                <p className="text-base font-semibold text-gray-400 dark:text-slate-500">Enter amount and GST rate</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8"><Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← All Calculators</Link></div>
      </main>
    </div>
  );
}
