'use client';

import { MONTH_NAMES } from '@/lib/utils';
import type { DownPaymentType } from '@/types';
import { RefreshCw } from 'lucide-react';

export interface LoanFormValues {
  propertyValue: string;
  downPayment: string;
  downPaymentType: DownPaymentType;
  loanAmount: string;
  loanAmountManual: boolean;
  interestRate: string;
  tenureYears: string;
  tenureMonths: string;
  loanStartMonth: number;
  loanStartYear: number;
}

interface Props {
  value: LoanFormValues;
  onFieldChange: (field: keyof LoanFormValues, value: string | number | boolean) => void;
  onLoanAmountChange: (value: string) => void;
  onResetLoanAmount: () => void;
  errors: Record<string, string>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {children}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-500 dark:text-red-400 text-xs mt-1">{msg}</p>;
}

const inputCls =
  'w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500';

const prefixInputCls =
  'w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500';

function CurrencyInput({
  value,
  onChange,
  placeholder = '0',
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium select-none">
        ₹
      </span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        min="0"
        className={`${prefixInputCls} ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-slate-800' : ''}`}
      />
    </div>
  );
}

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 31 }, (_, i) => currentYear - 5 + i);

export default function LoanDetailsForm({ value, onFieldChange, onLoanAmountChange, onResetLoanAmount, errors }: Props) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
          1
        </span>
        Loan Details
      </h2>

      <div className="space-y-4">
        {/* Property Value */}
        <div>
          <Label>Property Value</Label>
          <CurrencyInput
            value={value.propertyValue}
            onChange={v => onFieldChange('propertyValue', v)}
            placeholder="50,00,000"
          />
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Down Payment</Label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-slate-600 text-xs">
              {(['amount', 'percentage'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => onFieldChange('downPaymentType', type)}
                  className={`px-3 py-1 font-medium transition-colors ${
                    value.downPaymentType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
                  }`}
                >
                  {type === 'amount' ? '₹' : '%'}
                </button>
              ))}
            </div>
          </div>
          {value.downPaymentType === 'amount' ? (
            <CurrencyInput
              value={value.downPayment}
              onChange={v => onFieldChange('downPayment', v)}
              placeholder="10,00,000"
            />
          ) : (
            <div className="relative">
              <input
                type="number"
                value={value.downPayment}
                onChange={e => onFieldChange('downPayment', e.target.value)}
                placeholder="20"
                min="0"
                max="100"
                className={inputCls}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm select-none">
                %
              </span>
            </div>
          )}
        </div>

        {/* Loan Amount */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Loan Amount</Label>
            {value.loanAmountManual && (
              <button
                onClick={onResetLoanAmount}
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                <RefreshCw className="w-3 h-3" /> Auto-calculate
              </button>
            )}
          </div>
          <CurrencyInput
            value={value.loanAmount}
            onChange={onLoanAmountChange}
            placeholder="40,00,000"
          />
          {!value.loanAmountManual && value.propertyValue && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Auto-calculated from property value − down payment
            </p>
          )}
          <FieldError msg={errors.loanAmount} />
        </div>

        {/* Interest Rate */}
        <div>
          <Label>Annual Interest Rate</Label>
          <div className="relative">
            <input
              type="number"
              value={value.interestRate}
              onChange={e => onFieldChange('interestRate', e.target.value)}
              placeholder="8.5"
              min="0"
              max="30"
              step="0.1"
              className={inputCls}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm select-none">
              % p.a.
            </span>
          </div>
          <FieldError msg={errors.interestRate} />
        </div>

        {/* Tenure */}
        <div>
          <Label>Loan Tenure</Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="number"
                  value={value.tenureYears}
                  onChange={e => onFieldChange('tenureYears', e.target.value)}
                  placeholder="20"
                  min="0"
                  max="30"
                  className={inputCls}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs select-none">
                  Yrs
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <input
                  type="number"
                  value={value.tenureMonths}
                  onChange={e => onFieldChange('tenureMonths', e.target.value)}
                  placeholder="0"
                  min="0"
                  max="11"
                  className={inputCls}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs select-none">
                  Mo
                </span>
              </div>
            </div>
          </div>
          <FieldError msg={errors.tenure} />
        </div>

        {/* Loan Start */}
        <div>
          <Label>Loan Start Date</Label>
          <div className="flex gap-3">
            <select
              value={value.loanStartMonth}
              onChange={e => onFieldChange('loanStartMonth', Number(e.target.value))}
              className={`flex-1 ${inputCls}`}
            >
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={value.loanStartYear}
              onChange={e => onFieldChange('loanStartYear', Number(e.target.value))}
              className={`flex-1 ${inputCls}`}
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
