'use client';

import { formatCurrency, formatMonthYear } from '@/lib/utils';
import { PlusCircle, IndianRupee, TrendingUp, Calendar, Layers } from 'lucide-react';

export interface TopUpResult {
  amount: number;
  emi: number;
  totalInterest: number;
  totalPayment: number;
  tenureMonths: number;
  payoffMonth: number;
  payoffYear: number;
  interestRate: number;
}

interface Props {
  result: TopUpResult;
  baseEMI: number;
}

function StatRow({ label, value, sub, highlight = false }: {
  label: string; value: string; sub?: string; highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-slate-700/60 last:border-0">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <div className="text-right">
        <span className={`text-sm font-semibold tabular-nums ${highlight ? 'text-purple-700 dark:text-purple-300' : 'text-gray-800 dark:text-gray-200'}`}>
          {value}
        </span>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

export default function TopUpResults({ result, baseEMI }: Props) {
  const combinedEMI = baseEMI + result.emi;
  const tenureLabel = (months: number) => {
    const y = Math.floor(months / 12);
    const m = months % 12;
    if (y === 0) return `${m} mo`;
    if (m === 0) return `${y} yr`;
    return `${y} yr ${m} mo`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-4 flex items-center gap-3">
        <div className="bg-white/20 p-1.5 rounded-lg">
          <PlusCircle className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Top-up Loan Summary</h3>
          <p className="text-purple-200 text-xs mt-0.5">
            {formatCurrency(result.amount)} @ {result.interestRate}% · {tenureLabel(result.tenureMonths)}
          </p>
        </div>
      </div>

      {/* Combined EMI highlight */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800 px-5 py-4">
        <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-3">
          Combined Monthly Outflow
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Home Loan EMI</p>
              <p className="text-base font-bold tabular-nums text-gray-700 dark:text-gray-300">{formatCurrency(baseEMI)}</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-700 dark:text-purple-200 font-bold text-sm">+</span>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Top-up EMI</p>
              <p className="text-base font-bold tabular-nums text-purple-700 dark:text-purple-300">{formatCurrency(result.emi)}</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-700 dark:text-purple-200 font-bold text-sm">=</span>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Combined</p>
              <p className="text-xl font-bold tabular-nums text-purple-700 dark:text-purple-300">{formatCurrency(combinedEMI)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top-up breakdown */}
      <div className="p-5">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" /> Top-up Breakdown
        </p>
        <StatRow label="Top-up Amount (Principal)" value={formatCurrency(result.amount)} />
        <StatRow label="Top-up EMI" value={formatCurrency(result.emi)} highlight />
        <StatRow label="Total Interest on Top-up" value={formatCurrency(result.totalInterest)} />
        <StatRow label="Total Top-up Payment" value={formatCurrency(result.totalPayment)} />
        <StatRow
          label="Top-up Payoff Date"
          value={formatMonthYear(result.payoffMonth, result.payoffYear)}
          sub={tenureLabel(result.tenureMonths)}
        />
      </div>

      {/* Mini summary cards */}
      <div className="grid grid-cols-3 gap-0 border-t border-gray-100 dark:border-slate-700">
        {[
          { icon: <IndianRupee className="w-4 h-4" />, label: 'EMI', val: formatCurrency(result.emi), color: 'text-purple-600 dark:text-purple-400' },
          { icon: <TrendingUp className="w-4 h-4" />, label: 'Interest', val: formatCurrency(result.totalInterest), color: 'text-amber-600 dark:text-amber-400' },
          { icon: <Calendar className="w-4 h-4" />, label: 'Payoff', val: formatMonthYear(result.payoffMonth, result.payoffYear), color: 'text-gray-700 dark:text-gray-300' },
        ].map((item, i) => (
          <div key={i} className={`p-3 text-center ${i < 2 ? 'border-r border-gray-100 dark:border-slate-700' : ''}`}>
            <div className={`flex justify-center mb-1 ${item.color}`}>{item.icon}</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{item.label}</p>
            <p className={`text-xs font-bold tabular-nums ${item.color}`}>{item.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
