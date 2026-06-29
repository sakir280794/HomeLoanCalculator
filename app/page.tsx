'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Calculator, Moon, Sun, Home } from 'lucide-react';
import LoanDetailsForm, { type LoanFormValues } from '@/components/LoanDetailsForm';
import PrepaymentSection, { type PrepaymentFormValues } from '@/components/PrepaymentSection';
import TopUpSection, { type TopUpFormValues } from '@/components/TopUpSection';
import SummaryCards from '@/components/SummaryCards';
import EMIBooster from '@/components/EMIBooster';
import TopUpResults, { type TopUpResult } from '@/components/TopUpResults';
import AmortizationTable from '@/components/AmortizationTable';
import LoanCharts from '@/components/LoanCharts';
import FeedbackSection from '@/components/FeedbackSection';
import { calculateLoan, calculateEMI } from '@/lib/calculations';
import type { AmortizationRow, BoosterInputs, CompleteLoanResult, LoanInputs, LoanSummary, PrepaymentInputs } from '@/types';

const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();

const defaultLoan: LoanFormValues = {
  propertyValue: '',
  downPayment: '',
  downPaymentType: 'amount',
  loanAmount: '',
  loanAmountManual: false,
  interestRate: '8.5',
  tenureYears: '20',
  tenureMonths: '0',
  loanStartMonth: currentMonth,
  loanStartYear: currentYear,
};

const defaultPrep: PrepaymentFormValues = {
  enabled: false,
  monthlyExtra: '',
  oneTime: '',
  yearly: '',
  startMonth: currentMonth,
  startYear: currentYear,
  mode: 'reduce-tenure',
  lumpSums: [],
};

const defaultTopUp: TopUpFormValues = {
  enabled: false,
  amount: '',
  interestRate: '9.5',
  tenureYears: '10',
  tenureMonths: '0',
  startMonth: currentMonth,
  startYear: currentYear,
};

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [loanForm, setLoanForm] = useState<LoanFormValues>(defaultLoan);
  const [prepForm, setPrepForm] = useState<PrepaymentFormValues>(defaultPrep);
  const [topUpForm, setTopUpForm] = useState<TopUpFormValues>(defaultTopUp);
  const [result, setResult] = useState<CompleteLoanResult | null>(null);
  const [topUpResult, setTopUpResult] = useState<TopUpResult | null>(null);
  const [topUpScheduleData, setTopUpScheduleData] = useState<AmortizationRow[] | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  // Stored at calculate-time so boost useEffect can use them
  const [computedInputs, setComputedInputs] = useState<{ loan: LoanInputs; prep?: PrepaymentInputs } | null>(null);
  const [boostState, setBoostState] = useState({ emi: 0, month: currentMonth, year: currentYear });
  const [boostSummary, setBoostSummary] = useState<LoanSummary | null>(null);
  const [combinedSummary, setCombinedSummary] = useState<LoanSummary | null>(null);

  // Recompute boost/combined schedules reactively whenever boost slider moves
  useEffect(() => {
    if (!computedInputs || !result) {
      setBoostSummary(null);
      setCombinedSummary(null);
      return;
    }
    const roundedBase = Math.ceil(result.base.emi / 100) * 100;
    if (boostState.emi <= roundedBase) {
      setBoostSummary(null);
      setCombinedSummary(null);
      return;
    }
    const booster: BoosterInputs = {
      boostedEMI: boostState.emi,
      startMonth: boostState.month,
      startYear: boostState.year,
    };
    const boostResult = calculateLoan(computedInputs.loan, undefined, booster);
    setBoostSummary(boostResult.withBooster ?? null);
    if (computedInputs.prep) {
      const comboResult = calculateLoan(computedInputs.loan, computedInputs.prep, booster);
      setCombinedSummary(comboResult.withCombined ?? null);
    } else {
      setCombinedSummary(null);
    }
  }, [computedInputs, boostState, result]);

  const handleBoostChange = useCallback((emi: number, month: number, year: number) => {
    setBoostState({ emi, month, year });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('darkMode', String(next));
      return next;
    });
  }, []);

  const handleLoanField = useCallback(
    (field: keyof LoanFormValues, value: string | number | boolean) => {
      setLoanForm(prev => {
        const next = { ...prev, [field]: value };
        if (
          (field === 'propertyValue' || field === 'downPayment' || field === 'downPaymentType') &&
          !prev.loanAmountManual
        ) {
          const pv = parseFloat(String(field === 'propertyValue' ? value : next.propertyValue)) || 0;
          const dp = parseFloat(String(field === 'downPayment' ? value : next.downPayment)) || 0;
          const dpType = (field === 'downPaymentType' ? value : next.downPaymentType) as string;
          const dpAmt = dpType === 'percentage' ? (pv * dp) / 100 : dp;
          next.loanAmount = pv > 0 ? String(Math.max(0, Math.round(pv - dpAmt))) : '';
        }
        return next;
      });
    },
    []
  );

  const handleLoanAmountChange = useCallback((value: string) => {
    setLoanForm(prev => ({ ...prev, loanAmount: value, loanAmountManual: true }));
  }, []);

  const resetLoanAmount = useCallback(() => {
    setLoanForm(prev => {
      const pv = parseFloat(prev.propertyValue) || 0;
      const dp = parseFloat(prev.downPayment) || 0;
      const dpAmt = prev.downPaymentType === 'percentage' ? (pv * dp) / 100 : dp;
      return { ...prev, loanAmount: String(Math.max(0, Math.round(pv - dpAmt))), loanAmountManual: false };
    });
  }, []);

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    const la = parseFloat(loanForm.loanAmount);
    const rate = parseFloat(loanForm.interestRate);
    const years = parseInt(loanForm.tenureYears) || 0;
    const months = parseInt(loanForm.tenureMonths) || 0;

    if (!la || la <= 0) errs.loanAmount = 'Loan amount must be greater than ₹0';
    if (isNaN(rate) || rate < 0) errs.interestRate = 'Enter a valid interest rate (0 or above)';
    if (rate > 50) errs.interestRate = 'Interest rate seems too high (max 50%)';
    if (years * 12 + months <= 0) errs.tenure = 'Tenure must be at least 1 month';
    if (years > 30) errs.tenure = 'Tenure cannot exceed 30 years';

    if (prepForm.enabled) {
      const total =
        (parseFloat(prepForm.monthlyExtra) || 0) +
        (parseFloat(prepForm.oneTime) || 0) +
        (parseFloat(prepForm.yearly) || 0) +
        prepForm.lumpSums.reduce((s, ls) => s + (parseFloat(ls.amount) || 0), 0);
      if (total <= 0) errs.prepayment = 'Enter at least one prepayment amount';
    }

    if (topUpForm.enabled) {
      const ta = parseFloat(topUpForm.amount);
      const tr = parseFloat(topUpForm.interestRate);
      const ty = parseInt(topUpForm.tenureYears) || 0;
      const tm = parseInt(topUpForm.tenureMonths) || 0;
      if (!ta || ta <= 0) errs.topUpAmount = 'Top-up amount must be greater than ₹0';
      if (isNaN(tr) || tr < 0) errs.topUpRate = 'Enter a valid top-up interest rate';
      if (ty * 12 + tm <= 0) errs.topUpTenure = 'Top-up tenure must be at least 1 month';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [loanForm, prepForm, topUpForm]);

  const handleCalculate = useCallback(() => {
    if (!validate()) return;

    // Main loan calculation
    const loanInputs: LoanInputs = {
      propertyValue: parseFloat(loanForm.propertyValue) || 0,
      downPayment: parseFloat(loanForm.downPayment) || 0,
      downPaymentType: loanForm.downPaymentType,
      loanAmount: parseFloat(loanForm.loanAmount) || 0,
      interestRate: parseFloat(loanForm.interestRate) || 0,
      tenureYears: parseInt(loanForm.tenureYears) || 0,
      tenureMonths: parseInt(loanForm.tenureMonths) || 0,
      loanStartMonth: loanForm.loanStartMonth,
      loanStartYear: loanForm.loanStartYear,
    };

    const prepInputs: PrepaymentInputs | undefined = prepForm.enabled
      ? {
          enabled: true,
          monthlyExtra: parseFloat(prepForm.monthlyExtra) || 0,
          oneTime: parseFloat(prepForm.oneTime) || 0,
          yearly: parseFloat(prepForm.yearly) || 0,
          startMonth: prepForm.startMonth,
          startYear: prepForm.startYear,
          mode: prepForm.mode,
          lumpSums: prepForm.lumpSums
            .filter(ls => (parseFloat(ls.amount) || 0) > 0)
            .map(ls => ({ amount: parseFloat(ls.amount), month: ls.month, year: ls.year })),
        }
      : undefined;

    const calculated = calculateLoan(loanInputs, prepInputs);
    setResult(calculated);
    setComputedInputs({ loan: loanInputs, prep: prepInputs });

    // Top-up loan calculation
    if (topUpForm.enabled) {
      const ta = parseFloat(topUpForm.amount) || 0;
      const tr = parseFloat(topUpForm.interestRate) || 0;
      const tm = (parseInt(topUpForm.tenureYears) || 0) * 12 + (parseInt(topUpForm.tenureMonths) || 0);
      const tEMI = calculateEMI(ta, tr, tm);
      const tInterest = tEMI * tm - ta;
      // Compute payoff date from topUp start
      const absStart = topUpForm.startYear * 12 + (topUpForm.startMonth - 1) + (tm - 1);
      setTopUpResult({
        amount: ta,
        emi: tEMI,
        totalInterest: tInterest,
        totalPayment: ta + tInterest,
        tenureMonths: tm,
        payoffMonth: (absStart % 12) + 1,
        payoffYear: Math.floor(absStart / 12),
        interestRate: tr,
      });
      const topUpLoan = calculateLoan({
        propertyValue: 0, downPayment: 0, downPaymentType: 'amount',
        loanAmount: ta, interestRate: tr,
        tenureYears: parseInt(topUpForm.tenureYears) || 0,
        tenureMonths: parseInt(topUpForm.tenureMonths) || 0,
        loanStartMonth: topUpForm.startMonth,
        loanStartYear: topUpForm.startYear,
      });
      setTopUpScheduleData(topUpLoan.base.schedule);
    } else {
      setTopUpResult(null);
      setTopUpScheduleData(null);
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, [loanForm, prepForm, topUpForm, validate]);

  const loanAmount = parseFloat(loanForm.loanAmount) || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Home Loan Calculator</h1>
              <p className="text-indigo-200 text-xs mt-0.5">Plan your dream home financing</p>
            </div>
          </div>
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">

          {/* ── Form column ── */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <LoanDetailsForm
              value={loanForm}
              onFieldChange={handleLoanField}
              onLoanAmountChange={handleLoanAmountChange}
              onResetLoanAmount={resetLoanAmount}
              errors={errors}
            />
            <PrepaymentSection value={prepForm} onChange={setPrepForm} errors={errors} />
            <TopUpSection
              value={topUpForm}
              onChange={setTopUpForm}
              errors={errors}
              baseLoanAmount={loanAmount}
            />
            <button
              onClick={handleCalculate}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg text-base active:scale-95"
            >
              <Calculator className="w-5 h-5" />
              Calculate EMI
            </button>
          </div>

          {/* ── Results column ── */}
          <div ref={resultsRef} className="min-w-0">
            {result ? (
              <div className="space-y-5">
                {/* Summary */}
                <SummaryCards result={result} />

                {/* EMI Booster — shown right after the summary */}
                <EMIBooster
                  loanAmount={loanAmount}
                  interestRate={parseFloat(loanForm.interestRate) || 0}
                  baseEMI={result.base.emi}
                  loanStartMonth={loanForm.loanStartMonth}
                  loanStartYear={loanForm.loanStartYear}
                  onBoostChange={handleBoostChange}
                />

                {/* Top-up results */}
                {topUpResult && (
                  <TopUpResults result={topUpResult} baseEMI={result.base.emi} />
                )}

                {/* Charts */}
                <LoanCharts result={result} />

                {/* Amortization table */}
                <AmortizationTable
                  result={result}
                  loanAmount={loanAmount}
                  emi={result.base.emi}
                  totalInterest={result.base.totalInterest}
                  totalPayment={result.base.totalPayment}
                  topUpSchedule={topUpScheduleData ?? undefined}
                  topUpSummary={topUpResult ? {
                    loanAmount: topUpResult.amount,
                    emi: topUpResult.emi,
                    totalInterest: topUpResult.totalInterest,
                    totalPayment: topUpResult.totalPayment,
                  } : undefined}
                  boostSummary={boostSummary ?? undefined}
                  combinedSummary={combinedSummary ?? undefined}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-96 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-5">
                  <Calculator className="w-10 h-10 text-indigo-300 dark:text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-400 dark:text-slate-500 text-center">
                  Your results will appear here
                </h3>
                <p className="text-sm text-gray-300 dark:text-slate-600 text-center mt-2 max-w-xs">
                  Fill in the loan details and click &quot;Calculate EMI&quot; to see the breakdown
                </p>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md">
                  {[
                    { label: 'EMI Breakdown', desc: 'Principal + Interest' },
                    { label: 'EMI Booster', desc: 'Reduce tenure fast' },
                    { label: 'Top-up Loan', desc: 'Combined EMI view' },
                    { label: 'Amortization', desc: 'Month-by-month table' },
                  ].map(h => (
                    <div key={h.label} className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{h.label}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{h.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Feedback section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <FeedbackSection />
      </div>

      <footer className="mt-12 py-8 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Built by <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Sakirhusain Syed</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Results are indicative. Consult your lender for exact figures.
          </p>
        </div>
      </footer>
    </div>
  );
}
