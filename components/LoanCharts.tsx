'use client';

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { formatCurrency, formatCompactCurrency, MONTH_SHORT } from '@/lib/utils';
import type { CompleteLoanResult } from '@/types';

interface Props {
  result: CompleteLoanResult;
}

const COLORS = {
  principal: '#4F46E5',
  interest: '#F59E0B',
  baseBalance: '#4F46E5',
  prepBalance: '#10B981',
};

interface TooltipPayload {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string; payload?: Record<string, number> }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipPayload) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</p>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-500 dark:text-gray-400">{entry.name}:</span>
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {formatCurrency(entry.value ?? 0)}
          </span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: TooltipPayload) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const total = item.payload?.total ?? 1;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{item.name}</p>
      <p className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(item.value ?? 0)}</p>
      <p className="text-gray-400 dark:text-gray-500">
        {(((item.value ?? 0) / total) * 100).toFixed(1)}%
      </p>
    </div>
  );
}

// Sample balance data at yearly intervals to keep chart clean
function sampleYearly(schedule: CompleteLoanResult['base']['schedule']) {
  const result = [];
  for (let i = 0; i < schedule.length; i++) {
    const row = schedule[i];
    // Include first month, every 12th month, and last month
    if (i === 0 || (i + 1) % 12 === 0 || i === schedule.length - 1) {
      result.push(row);
    }
  }
  return result;
}

export default function LoanCharts({ result }: Props) {
  const { base, withPrepayment } = result;
  const loanAmount = base.totalPayment - base.totalInterest;
  const totalInterest = base.totalInterest;
  const total = loanAmount + totalInterest;

  const pieData = [
    { name: 'Principal', value: loanAmount, total },
    { name: 'Interest', value: totalInterest, total },
  ];

  // Balance over time chart
  const baseSampled = sampleYearly(base.schedule);
  const prepSampled = withPrepayment ? sampleYearly(withPrepayment.schedule) : [];

  // Merge by month index for the chart
  const balanceData = baseSampled.map((row, i) => {
    const label = `${MONTH_SHORT[row.calendarMonth - 1]} ${row.calendarYear}`;
    const entry: Record<string, string | number> = {
      month: label,
      'Standard': Math.round(row.balance),
    };
    if (withPrepayment && prepSampled[i]) {
      entry['With Prepayment'] = Math.round(prepSampled[i].balance);
    }
    return entry;
  });

  // If with prepayment has fewer months, append the remaining base-only points
  if (withPrepayment) {
    for (let i = prepSampled.length; i < baseSampled.length; i++) {
      const row = baseSampled[i];
      const label = `${MONTH_SHORT[row.calendarMonth - 1]} ${row.calendarYear}`;
      balanceData[i] = {
        month: label,
        'Standard': Math.round(row.balance),
        'With Prepayment': 0,
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomLabel = (props: any) => {
    const cx: number = props.cx ?? 0;
    const cy: number = props.cy ?? 0;
    const midAngle: number = props.midAngle ?? 0;
    const innerRadius: number = props.innerRadius ?? 0;
    const outerRadius: number = props.outerRadius ?? 0;
    const percent: number = props.percent ?? 0;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600}>
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Pie Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Principal vs Interest</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
            >
              <Cell fill={COLORS.principal} />
              <Cell fill={COLORS.interest} />
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">Principal</p>
            <p className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums text-sm">
              {formatCurrency(loanAmount)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">Interest</p>
            <p className="font-bold text-amber-600 dark:text-amber-400 tabular-nums text-sm">
              {formatCurrency(totalInterest)}
            </p>
          </div>
        </div>
      </div>

      {/* Balance Over Time */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Loan Balance Over Time
          {withPrepayment && (
            <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500">(yearly)</span>
          )}
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={balanceData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="gradBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.baseBalance} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.baseBalance} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPrep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.prepBalance} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.prepBalance} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:[&_line]:stroke-slate-600/50" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              interval="preserveStartEnd"
              tickLine={false}
            />
            <YAxis
              tickFormatter={v => formatCompactCurrency(v)}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="Standard"
              stroke={COLORS.baseBalance}
              strokeWidth={2}
              fill="url(#gradBase)"
              dot={false}
            />
            {withPrepayment && (
              <Area
                type="monotone"
                dataKey="With Prepayment"
                stroke={COLORS.prepBalance}
                strokeWidth={2}
                fill="url(#gradPrep)"
                dot={false}
              />
            )}
            <Legend
              formatter={(value) => (
                <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>
              )}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
