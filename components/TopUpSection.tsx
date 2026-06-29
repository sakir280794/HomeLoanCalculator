'use client';

import { MONTH_NAMES } from '@/lib/utils';

export interface TopUpFormValues {
  enabled: boolean;
  amount: string;
  interestRate: string;
  tenureYears: string;
  tenureMonths: string;
  startMonth: number;
  startYear: number;
}

interface Props {
  value: TopUpFormValues;
  onChange: (v: TopUpFormValues) => void;
  errors: Record<string, string>;
  baseLoanAmount?: number;
}

const inputCls =
  'w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500';

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 31 }, (_, i) => currentYear - 2 + i);

export default function TopUpSection({ value, onChange, errors, baseLoanAmount }: Props) {
  const set = (patch: Partial<TopUpFormValues>) => onChange({ ...value, ...patch });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-400">
            3
          </span>
          Top-up Loan
        </h2>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={e => set({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:bg-purple-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
        </label>
      </div>

      {value.enabled ? (
        <div className="space-y-4">
          {/* Context hint */}
          {baseLoanAmount ? (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg p-3">
              <p className="text-xs text-purple-700 dark:text-purple-300">
                <span className="font-semibold">Base loan:</span> top-up is additional borrowing on your existing home loan, typically at a similar or slightly higher interest rate.
              </p>
            </div>
          ) : null}

          {/* Top-up Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Top-up Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium select-none">₹</span>
              <input
                type="number"
                value={value.amount}
                onChange={e => set({ amount: e.target.value })}
                placeholder="10,00,000"
                min="0"
                className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            {errors.topUpAmount && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.topUpAmount}</p>
            )}
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Top-up Interest Rate
            </label>
            <div className="relative">
              <input
                type="number"
                value={value.interestRate}
                onChange={e => set({ interestRate: e.target.value })}
                placeholder="9.5"
                min="0"
                max="30"
                step="0.1"
                className={inputCls}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm select-none">% p.a.</span>
            </div>
            {errors.topUpRate && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.topUpRate}</p>
            )}
          </div>

          {/* Tenure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Top-up Tenure
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={value.tenureYears}
                  onChange={e => set({ tenureYears: e.target.value })}
                  placeholder="10"
                  min="0"
                  max="30"
                  className={inputCls}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs select-none">Yrs</span>
              </div>
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={value.tenureMonths}
                  onChange={e => set({ tenureMonths: e.target.value })}
                  placeholder="0"
                  min="0"
                  max="11"
                  className={inputCls}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs select-none">Mo</span>
              </div>
            </div>
            {errors.topUpTenure && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.topUpTenure}</p>
            )}
          </div>

          {/* Disbursement date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Top-up Disbursement Date
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
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Enable to calculate an additional top-up loan on your existing home loan and see the combined EMI.
        </p>
      )}
    </div>
  );
}
