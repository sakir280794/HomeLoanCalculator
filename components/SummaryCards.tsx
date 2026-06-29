'use client';

import { formatCurrency, formatMonthYear } from '@/lib/utils';
import type { CompleteLoanResult } from '@/types';
import { TrendingDown, Calendar, IndianRupee, Clock, PiggyBank } from 'lucide-react';

interface Props {
  result: CompleteLoanResult;
}

interface CardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'green';
  highlight?: boolean;
}

const accentMap = {
  indigo: {
    icon: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
    value: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  cyan: {
    icon: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400',
    value: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
  emerald: {
    icon: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    value: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  amber: {
    icon: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    value: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
  green: {
    icon: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    value: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
};

function Card({ icon, label, value, sub, accent = 'indigo', highlight = false }: CardProps) {
  const a = accentMap[accent];
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl p-4 border ${highlight ? a.border : 'border-gray-200 dark:border-slate-700'} shadow-sm transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
          <p className={`text-xl font-bold mt-1 tabular-nums ${a.value}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg ${a.icon}`}>{icon}</div>
      </div>
    </div>
  );
}

function CompareRow({ label, base, prep }: { label: string; base: string; prep: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-right min-w-24">{base}</span>
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 text-right min-w-24">{prep}</span>
      </div>
    </div>
  );
}

export default function SummaryCards({ result }: Props) {
  const { base, withPrepayment, interestSaved, monthsSaved } = result;
  const hasPrepayment = !!withPrepayment;

  const monthsToYearsLabel = (months: number) => {
    const y = Math.floor(months / 12);
    const m = months % 12;
    if (y === 0) return `${m} mo`;
    if (m === 0) return `${y} yr`;
    return `${y} yr ${m} mo`;
  };

  return (
    <div className="space-y-4">
      {/* Main summary grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <Card
          icon={<IndianRupee className="w-5 h-5" />}
          label="Monthly EMI"
          value={formatCurrency(base.emi)}
          accent="indigo"
          highlight
        />
        <Card
          icon={<TrendingDown className="w-5 h-5" />}
          label="Total Interest"
          value={formatCurrency(base.totalInterest)}
          accent="amber"
        />
        <Card
          icon={<PiggyBank className="w-5 h-5" />}
          label="Total Payment"
          value={formatCurrency(base.totalPayment)}
          accent="cyan"
        />
        <Card
          icon={<Calendar className="w-5 h-5" />}
          label="Loan Payoff"
          value={formatMonthYear(base.payoffMonth, base.payoffYear)}
          sub={monthsToYearsLabel(base.tenureMonths)}
          accent="emerald"
        />
      </div>

      {/* Prepayment savings */}
      {hasPrepayment && withPrepayment && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white">Prepayment Savings</h3>
          </div>
          <div className="p-4">
            {/* Savings highlights */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-center border border-emerald-100 dark:border-emerald-800">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Interest Saved</p>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 tabular-nums mt-0.5">
                  {formatCurrency(interestSaved ?? 0)}
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-center border border-emerald-100 dark:border-emerald-800">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Months Saved</p>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 tabular-nums mt-0.5">
                  {monthsSaved ?? 0} mo
                </p>
              </div>
            </div>

            {/* Comparison table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 dark:text-gray-500"></span>
                <div className="flex items-center gap-6">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 min-w-24 text-right">Without Prepayment</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 min-w-24 text-right">With Prepayment</span>
                </div>
              </div>
              <CompareRow
                label="Monthly EMI"
                base={formatCurrency(base.emi)}
                prep={formatCurrency(withPrepayment.emi)}
              />
              <CompareRow
                label="Total Interest"
                base={formatCurrency(base.totalInterest)}
                prep={formatCurrency(withPrepayment.totalInterest)}
              />
              <CompareRow
                label="Total Payment"
                base={formatCurrency(base.totalPayment)}
                prep={formatCurrency(withPrepayment.totalPayment)}
              />
              <CompareRow
                label="Loan Payoff"
                base={formatMonthYear(base.payoffMonth, base.payoffYear)}
                prep={formatMonthYear(withPrepayment.payoffMonth, withPrepayment.payoffYear)}
              />
              <CompareRow
                label="Tenure"
                base={monthsToYearsLabel(base.tenureMonths)}
                prep={monthsToYearsLabel(withPrepayment.tenureMonths)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
