export type DownPaymentType = 'amount' | 'percentage';
export type PrepaymentMode = 'reduce-tenure' | 'reduce-emi';

export interface LoanInputs {
  propertyValue: number;
  downPayment: number;
  downPaymentType: DownPaymentType;
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  tenureMonths: number;
  loanStartMonth: number;
  loanStartYear: number;
}

export interface LumpSumEntry {
  amount: number;
  month: number;
  year: number;
}

export interface PrepaymentInputs {
  enabled: boolean;
  monthlyExtra: number;
  oneTime: number;
  yearly: number;
  startMonth: number;
  startYear: number;
  mode: PrepaymentMode;
  lumpSums?: LumpSumEntry[];
}

export interface AmortizationRow {
  monthNumber: number;
  calendarMonth: number;
  calendarYear: number;
  emi: number;
  principal: number;
  interest: number;
  prepayment: number;
  balance: number;
}

export interface LoanSummary {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  tenureMonths: number;
  payoffMonth: number;
  payoffYear: number;
  schedule: AmortizationRow[];
}

export interface BoosterInputs {
  boostedEMI: number;
  startMonth: number;
  startYear: number;
}

export interface CompleteLoanResult {
  base: LoanSummary;
  withPrepayment?: LoanSummary;
  withBooster?: LoanSummary;
  withCombined?: LoanSummary;
  interestSaved?: number;
  monthsSaved?: number;
}
