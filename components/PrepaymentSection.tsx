'use client';

import { MONTH_NAMES } from '@/lib/utils';
import type { PrepaymentMode } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

export interface LumpSumFormEntry {
  amount: string;
  month: number;
  year: number;
}

export interface PrepaymentFormValues {
  enabled: boolean;
  monthlyExtra: string;
  oneTime: string;
  yearly: string;
  startMonth: number;
  startYear: number;
  mode: PrepaymentMode;
  lumpSums: LumpSumFormEntry[];
}

interface Props {
  value: PrepaymentFormValues;
  onChange: (v: PrepaymentFormValues) => void;
  errors: Record<string, string>;
}

const inputCls =
  'w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500';

const selectCls =
  'rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';

function CurrencyInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium select-none">
        ₹
      </span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0"
        min="0"
        className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500"
      />
    </div>
  );
}

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const yearOptions = Array.from({ length: 31 }, (_, i) => currentYear - 2 + i);

export default function PrepaymentSection({ value, onChange, errors }: Props) {
  const set = (patch: Partial<PrepaymentFormValues>) => onChange({ ...value, ...patch });

  const addLumpSum = () => {
    set({
      lumpSums: [...value.lumpSums, { amount: '', month: currentMonth, year: currentYear }],
    });
  };

  const updateLumpSum = (i: number, patch: Partial<LumpSumFormEntry>) => {
    const updated = value.lumpSums.map((ls, idx) => idx === i ? { ...ls, ...patch } : ls);
    set({ lumpSums: updated });
  };

  const removeLumpSum = (i: number) => {
    set({ lumpSums: value.lumpSums.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
            2
          </span>
          Prepayment
        </h2>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={e => set({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:bg-indigo-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
        </label>
      </div>

      {value.enabled && (
        <div className="space-y-4">
          {/* Monthly Extra */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Monthly Extra Payment
            </label>
            <CurrencyInput value={value.monthlyExtra} onChange={v => set({ monthlyExtra: v })} />
          </div>

          {/* One-time Prepayment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              One-Time Prepayment
            </label>
            <CurrencyInput value={value.oneTime} onChange={v => set({ oneTime: v })} />
          </div>

          {/* Yearly Prepayment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Yearly Prepayment
            </label>
            <CurrencyInput value={value.yearly} onChange={v => set({ yearly: v })} />
          </div>

          {/* Start Date — applies to monthly/one-time/yearly above */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Prepayment Starts From
            </label>
            <div className="flex gap-3">
              <select
                value={value.startMonth}
                onChange={e => set({ startMonth: Number(e.target.value) })}
                className={`flex-1 ${inputCls}`}
              >
                {MONTH_NAMES.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                value={value.startYear}
                onChange={e => set({ startYear: Number(e.target.value) })}
                className={`flex-1 ${inputCls}`}
              >
                {yearOptions.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-slate-700" />

          {/* Lump Sum / Random Payments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Lump Sum Payments
              </label>
              <button
                type="button"
                onClick={addLumpSum}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Payment
              </button>
            </div>

            {value.lumpSums.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 py-1">
                Add one-off payments at specific months — e.g. a bonus or maturity payout.
              </p>
            ) : (
              <div className="space-y-2">
                {value.lumpSums.map((ls, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {/* Amount */}
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm select-none pointer-events-none">₹</span>
                      <input
                        type="number"
                        value={ls.amount}
                        onChange={e => updateLumpSum(i, { amount: e.target.value })}
                        placeholder="Amount"
                        min="0"
                        className="w-full pl-7 pr-2 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    {/* Month */}
                    <select
                      value={ls.month}
                      onChange={e => updateLumpSum(i, { month: Number(e.target.value) })}
                      className={selectCls}
                    >
                      {MONTH_NAMES.map((m, mi) => (
                        <option key={m} value={mi + 1}>{m.slice(0, 3)}</option>
                      ))}
                    </select>
                    {/* Year */}
                    <select
                      value={ls.year}
                      onChange={e => updateLumpSum(i, { year: Number(e.target.value) })}
                      className={selectCls}
                    >
                      {yearOptions.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeLumpSum(i)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prepayment Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { mode: 'reduce-tenure' as const, label: 'Reduce Tenure', desc: 'Keep EMI, pay off earlier' },
                { mode: 'reduce-emi' as const, label: 'Reduce EMI', desc: 'Lower monthly payment' },
              ]).map(({ mode, label, desc }) => (
                <button
                  key={mode}
                  onClick={() => set({ mode })}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    value.mode === mode
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                      : 'border-gray-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <p className={`text-xs font-semibold ${value.mode === mode ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {errors.prepayment && (
            <p className="text-red-500 dark:text-red-400 text-xs">{errors.prepayment}</p>
          )}
        </div>
      )}

      {!value.enabled && (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Enable prepayment to see how extra payments reduce your interest and tenure.
        </p>
      )}
    </div>
  );
}
