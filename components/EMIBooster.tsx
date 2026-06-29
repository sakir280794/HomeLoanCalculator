'use client';

import { useState, useEffect, useMemo } from 'react';
import { formatCurrency, formatMonthYear, MONTH_NAMES } from '@/lib/utils';
import { Zap, TrendingDown, Calendar, Clock, ArrowRight } from 'lucide-react';

interface Props {
  loanAmount: number;
  interestRate: number;
  baseEMI: number;
  loanStartMonth: number;
  loanStartYear: number;
  onBoostChange?: (emi: number, month: number, year: number) => void;
}

// Closed-form tenure from EMI
function calcTenureFromEMI(principal: number, annualRate: number, emi: number): number {
  if (principal <= 0 || emi <= 0) return 0;
  if (annualRate === 0) return Math.ceil(principal / emi);
  const r = annualRate / 12 / 100;
  const minEMI = principal * r;
  if (emi <= minEMI + 0.01) return 9999;
  return Math.ceil(-Math.log(1 - (principal * r) / emi) / Math.log(1 + r));
}

// Outstanding balance after n months of paying `emi`
function balanceAfterMonths(P: number, annualRate: number, emi: number, n: number): number {
  if (n <= 0) return P;
  if (annualRate === 0) return Math.max(0, P - emi * n);
  const r = annualRate / 12 / 100;
  return P * Math.pow(1 + r, n) - emi * ((Math.pow(1 + r, n) - 1) / r);
}

function getPayoffDate(startMonth: number, startYear: number, tenureMonths: number) {
  if (tenureMonths >= 9999) return { month: startMonth, year: startYear + 100 };
  const abs = startYear * 12 + (startMonth - 1) + (tenureMonths - 1);
  return { month: (abs % 12) + 1, year: Math.floor(abs / 12) };
}

function tenureLabel(months: number) {
  if (months >= 9999) return '∞';
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}

const selectCls =
  'flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors';

export default function EMIBooster({ loanAmount, interestRate, baseEMI, loanStartMonth, loanStartYear, onBoostChange }: Props) {
  const roundedBase = Math.ceil(baseEMI / 100) * 100;
  const maxEMI = roundedBase * 3;

  // Use string state for the input so the user can type freely
  const [inputStr, setInputStr] = useState(String(roundedBase));
  const [customEMI, setCustomEMI] = useState(roundedBase);

  // Boost start date (defaults to loan start)
  const [boostMonth, setBoostMonth] = useState(loanStartMonth);
  const [boostYear, setBoostYear] = useState(loanStartYear);

  // Reset when base EMI changes (new calculation)
  useEffect(() => {
    const base = Math.ceil(baseEMI / 100) * 100;
    setInputStr(String(base));
    setCustomEMI(base);
    setBoostMonth(loanStartMonth);
    setBoostYear(loanStartYear);
  }, [baseEMI, loanStartMonth, loanStartYear]);

  // Notify parent whenever boost params change
  useEffect(() => {
    onBoostChange?.(customEMI, boostMonth, boostYear);
  }, [customEMI, boostMonth, boostYear, onBoostChange]);

  const baseTenure = useMemo(
    () => calcTenureFromEMI(loanAmount, interestRate, roundedBase),
    [loanAmount, interestRate, roundedBase]
  );

  // Year options: from loan start to payoff year
  const payoffYear = loanStartYear + Math.ceil(baseTenure / 12) + 1;
  const yearOptions = Array.from(
    { length: Math.max(1, payoffYear - loanStartYear) },
    (_, i) => loanStartYear + i
  );

  const stats = useMemo(() => {
    // How many months from loan start before boost kicks in
    const offsetMonths = Math.max(
      0,
      (boostYear - loanStartYear) * 12 + (boostMonth - loanStartMonth)
    );
    const cappedOffset = Math.min(offsetMonths, baseTenure - 1);

    // Balance at the moment boost starts
    const balanceAtBoost = balanceAfterMonths(loanAmount, interestRate, roundedBase, cappedOffset);

    // New tenure from that balance with boosted EMI
    const boostTenure = customEMI > roundedBase
      ? calcTenureFromEMI(balanceAtBoost, interestRate, customEMI)
      : calcTenureFromEMI(balanceAtBoost, interestRate, roundedBase);

    const totalNewTenure = cappedOffset + boostTenure;

    // Total interest:
    //   before boost: base_EMI * cappedOffset - principal_repaid_before
    //   after boost:  boosted_EMI * boostTenure - remaining_balance
    // Simplifies to: base_EMI * cappedOffset + boosted_EMI * boostTenure - loanAmount
    const baseTotalInterest = roundedBase * baseTenure - loanAmount;
    const newTotalInterest =
      roundedBase * cappedOffset +
      (customEMI > roundedBase ? customEMI : roundedBase) * boostTenure -
      loanAmount;

    const basePayoff = getPayoffDate(loanStartMonth, loanStartYear, baseTenure);
    const newPayoff = getPayoffDate(loanStartMonth, loanStartYear, totalNewTenure);

    return {
      baseTenure,
      totalNewTenure,
      monthsSaved: baseTenure - totalNewTenure,
      interestSaved: baseTotalInterest - newTotalInterest,
      baseTotalInterest,
      newTotalInterest,
      basePayoff,
      newPayoff,
    };
  }, [
    loanAmount, interestRate, roundedBase, customEMI,
    baseTenure, boostMonth, boostYear, loanStartMonth, loanStartYear,
  ]);

  const isIncreased = customEMI > roundedBase;
  const pct = Math.round(((customEMI - roundedBase) / roundedBase) * 100);
  const sliderPct = Math.min(100, ((customEMI - roundedBase) / (maxEMI - roundedBase)) * 100);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputStr(e.target.value); // allow free typing
    const num = parseInt(e.target.value);
    if (!isNaN(num) && num >= roundedBase) setCustomEMI(num);
  };

  const handleInputBlur = () => {
    const num = parseInt(inputStr);
    if (isNaN(num) || num < roundedBase) {
      setCustomEMI(roundedBase);
      setInputStr(String(roundedBase));
    } else {
      setCustomEMI(num);
      setInputStr(String(num));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setCustomEMI(v);
    setInputStr(String(v));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40">
          <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">EMI Booster</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">Increase your EMI to close the loan faster</p>
        </div>
        {isIncreased && (
          <span className="ml-auto text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full">
            +{pct}% EMI
          </span>
        )}
      </div>

      {/* Slider */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Monthly EMI</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 line-through tabular-nums">{formatCurrency(roundedBase)}</span>
            <ArrowRight className="w-3 h-3 text-gray-400" />
            <span className="text-base font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {formatCurrency(customEMI)}
            </span>
          </div>
        </div>
        <input
          type="range"
          min={roundedBase}
          max={maxEMI}
          step={500}
          value={Math.min(customEMI, maxEMI)}
          onChange={handleSliderChange}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #F59E0B ${sliderPct}%, #E5E7EB ${sliderPct}%)`,
          }}
        />
        <div className="flex justify-between mt-1.5 text-xs text-gray-400 dark:text-gray-500">
          <span>{formatCurrency(roundedBase)} (base)</span>
          <span>{formatCurrency(maxEMI)}</span>
        </div>
      </div>

      {/* Direct EMI input — free-type, validate on blur */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium select-none pointer-events-none">
          ₹
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={inputStr}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={e => e.target.select()}
          className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
          placeholder={String(roundedBase)}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500 select-none pointer-events-none">
          /month
        </span>
      </div>

      {/* Start month/year selectors */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Increased EMI Starts From
        </label>
        <div className="flex gap-2">
          <select
            value={boostMonth}
            onChange={e => setBoostMonth(Number(e.target.value))}
            className={selectCls}
          >
            {MONTH_NAMES.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={boostYear}
            onChange={e => setBoostYear(Number(e.target.value))}
            className={selectCls}
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Base EMI is paid until this date; boosted EMI applies from here
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Loan Tenure</p>
          </div>
          {isIncreased ? (
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 line-through tabular-nums mb-0.5">
                {tenureLabel(stats.baseTenure)}
              </p>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {tenureLabel(stats.totalNewTenure)}
              </p>
            </div>
          ) : (
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
              {tenureLabel(stats.baseTenure)}
            </p>
          )}
        </div>

        <div className={`rounded-xl p-3.5 ${isIncreased ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800' : 'bg-gray-50 dark:bg-slate-700/50'}`}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Months Saved</p>
          </div>
          <p className={`text-sm font-bold tabular-nums ${isIncreased ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'}`}>
            {isIncreased ? `${stats.monthsSaved} months` : '—'}
          </p>
        </div>

        <div className={`rounded-xl p-3.5 ${isIncreased ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800' : 'bg-gray-50 dark:bg-slate-700/50'}`}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Interest Saved</p>
          </div>
          {isIncreased ? (
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 line-through tabular-nums mb-0.5">
                {formatCurrency(stats.baseTotalInterest)}
              </p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatCurrency(stats.interestSaved)}
              </p>
            </div>
          ) : (
            <p className="text-sm font-bold text-gray-400 dark:text-gray-500">—</p>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Loan Payoff</p>
          </div>
          {isIncreased ? (
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 line-through mb-0.5">
                {formatMonthYear(stats.basePayoff.month, stats.basePayoff.year)}
              </p>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {formatMonthYear(stats.newPayoff.month, stats.newPayoff.year)}
              </p>
            </div>
          ) : (
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {formatMonthYear(stats.basePayoff.month, stats.basePayoff.year)}
            </p>
          )}
        </div>
      </div>

      {!isIncreased && (
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
          Type or drag to set a higher EMI and instantly see tenure & savings
        </p>
      )}
    </div>
  );
}
