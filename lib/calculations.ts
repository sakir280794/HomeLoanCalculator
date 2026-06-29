import type { AmortizationRow, BoosterInputs, CompleteLoanResult, LoanInputs, LoanSummary, PrepaymentInputs } from '@/types';

export function calculateEMI(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12 / 100;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function buildSchedule(
  principal: number,
  annualRate: number,
  months: number,
  startMonth: number,
  startYear: number,
  prepayment?: PrepaymentInputs,
  booster?: BoosterInputs
): AmortizationRow[] {
  if (principal <= 0 || months <= 0) return [];

  const r = annualRate === 0 ? 0 : annualRate / 12 / 100;
  let emi = calculateEMI(principal, annualRate, months);
  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let calMonth = startMonth;
  let calYear = startYear;

  const boostAbsStart = booster ? (booster.startYear * 12 + booster.startMonth) : -1;

  // Month offset from loan start to prepayment start (0-based)
  let prepStartOffset = -1;
  if (prepayment?.enabled) {
    prepStartOffset = (prepayment.startYear - startYear) * 12 + (prepayment.startMonth - startMonth);
    if (prepStartOffset < 0) prepStartOffset = 0;
  }

  // Guard against infinite loops: cap at 2x the original tenure
  const maxMonths = months * 2 + 12;

  for (let i = 1; i <= maxMonths && balance > 0.01; i++) {
    // Apply EMI boost when we reach the boost start month
    if (booster) {
      const calAbs = calYear * 12 + calMonth;
      if (calAbs >= boostAbsStart && booster.boostedEMI > emi) {
        emi = booster.boostedEMI;
      }
    }

    const interest = balance * r;
    let principalPaid = emi - interest;

    if (principalPaid < 0) principalPaid = 0;

    // Final payment: pay off remaining balance
    if (principalPaid >= balance) {
      schedule.push({
        monthNumber: i,
        calendarMonth: calMonth,
        calendarYear: calYear,
        emi: balance + interest,
        principal: balance,
        interest,
        prepayment: 0,
        balance: 0,
      });
      break;
    }

    balance -= principalPaid;

    // Prepayment for this month
    let prepAmt = 0;
    if (prepayment?.enabled && prepStartOffset >= 0) {
      const offset = i - 1 - prepStartOffset; // 0-based months from prepayment start
      if (offset >= 0) {
        if (prepayment.monthlyExtra > 0) prepAmt += prepayment.monthlyExtra;
        if (prepayment.oneTime > 0 && offset === 0) prepAmt += prepayment.oneTime;
        if (prepayment.yearly > 0 && offset % 12 === 0) prepAmt += prepayment.yearly;
      }
    }
    // Lump sum payments scheduled for this calendar month
    if (prepayment?.lumpSums) {
      for (const ls of prepayment.lumpSums) {
        if (ls.amount > 0 && ls.month === calMonth && ls.year === calYear) {
          prepAmt += ls.amount;
        }
      }
    }

    prepAmt = Math.min(prepAmt, balance);
    if (prepAmt < 0) prepAmt = 0;
    balance -= prepAmt;
    if (balance < 0) balance = 0;

    schedule.push({
      monthNumber: i,
      calendarMonth: calMonth,
      calendarYear: calYear,
      emi,
      principal: principalPaid,
      interest,
      prepayment: prepAmt,
      balance,
    });

    // Advance calendar month
    calMonth++;
    if (calMonth > 12) { calMonth = 1; calYear++; }

    // Reduce-EMI mode: recalculate EMI after prepayment, then re-apply boost floor
    if (prepayment?.mode === 'reduce-emi' && prepAmt > 0 && balance > 0.01) {
      const remaining = months - i;
      if (remaining > 0) {
        emi = calculateEMI(balance, annualRate, remaining);
        // Maintain boost floor for the recalculated EMI
        if (booster) {
          const nextCalAbs = calYear * 12 + calMonth;
          if (nextCalAbs >= boostAbsStart && booster.boostedEMI > emi) {
            emi = booster.boostedEMI;
          }
        }
      }
    }

    if (balance <= 0.01) break;
  }

  return schedule;
}

function toSummary(schedule: AmortizationRow[], emi: number): LoanSummary {
  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);
  const totalPayment = schedule.reduce((s, r) => s + r.emi + r.prepayment, 0);
  const last = schedule[schedule.length - 1];
  return {
    emi,
    totalInterest,
    totalPayment,
    tenureMonths: schedule.length,
    payoffMonth: last.calendarMonth,
    payoffYear: last.calendarYear,
    schedule,
  };
}

export function calculateLoan(loan: LoanInputs, prepayment?: PrepaymentInputs, booster?: BoosterInputs): CompleteLoanResult {
  const totalMonths = loan.tenureYears * 12 + loan.tenureMonths;

  const baseSchedule = buildSchedule(
    loan.loanAmount,
    loan.interestRate,
    totalMonths,
    loan.loanStartMonth,
    loan.loanStartYear
  );

  if (baseSchedule.length === 0) {
    const empty: LoanSummary = {
      emi: 0, totalInterest: 0, totalPayment: 0, tenureMonths: 0,
      payoffMonth: loan.loanStartMonth, payoffYear: loan.loanStartYear, schedule: [],
    };
    return { base: empty };
  }

  const emi = calculateEMI(loan.loanAmount, loan.interestRate, totalMonths);
  const baseTotalInterest = baseSchedule.reduce((s, r) => s + r.interest, 0);
  const lastBase = baseSchedule[baseSchedule.length - 1];

  const base: LoanSummary = {
    emi,
    totalInterest: baseTotalInterest,
    totalPayment: loan.loanAmount + baseTotalInterest,
    tenureMonths: baseSchedule.length,
    payoffMonth: lastBase.calendarMonth,
    payoffYear: lastBase.calendarYear,
    schedule: baseSchedule,
  };

  const hasPrepayment =
    prepayment?.enabled &&
    (prepayment.monthlyExtra > 0 || prepayment.oneTime > 0 || prepayment.yearly > 0 ||
      (prepayment.lumpSums?.some(ls => ls.amount > 0) ?? false));

  const hasBoost = !!booster && booster.boostedEMI > emi;

  const result: CompleteLoanResult = { base };

  if (hasPrepayment) {
    const prepSchedule = buildSchedule(
      loan.loanAmount, loan.interestRate, totalMonths,
      loan.loanStartMonth, loan.loanStartYear, prepayment
    );
    const withPrepayment = toSummary(prepSchedule, prepSchedule[0]?.emi ?? emi);
    result.withPrepayment = withPrepayment;
    result.interestSaved = baseTotalInterest - withPrepayment.totalInterest;
    result.monthsSaved = baseSchedule.length - prepSchedule.length;
  }

  if (hasBoost) {
    const boostSchedule = buildSchedule(
      loan.loanAmount, loan.interestRate, totalMonths,
      loan.loanStartMonth, loan.loanStartYear, undefined, booster
    );
    result.withBooster = toSummary(boostSchedule, booster!.boostedEMI);
  }

  if (hasPrepayment && hasBoost) {
    const combinedSchedule = buildSchedule(
      loan.loanAmount, loan.interestRate, totalMonths,
      loan.loanStartMonth, loan.loanStartYear, prepayment, booster
    );
    result.withCombined = toSummary(combinedSchedule, booster!.boostedEMI);
  }

  return result;
}
