'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { Calculator } from 'lucide-react';

const inputCls = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function calcEMI(p: number, annualRate: number, months: number): number {
  const r = annualRate / 100 / 12;
  return (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

interface YearData { year: number; cumulativeBuyingCost: number; cumulativeRentingCost: number; propertyValue: number; }

export default function RentVsBuyCalculator() {
  const [propertyPrice, setPropertyPrice] = useState('8000000');
  const [downPaymentPct, setDownPaymentPct] = useState('20');
  const [loanRate, setLoanRate] = useState('8.5');
  const [loanTenure, setLoanTenure] = useState('20');
  const [monthlyRent, setMonthlyRent] = useState('25000');
  const [rentIncrement, setRentIncrement] = useState('5');
  const [propertyAppreciation, setPropertyAppreciation] = useState('6');
  const [investmentReturn, setInvestmentReturn] = useState('10');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<{ yearData: YearData[]; breakEvenYear: number | null; verdict: 'buy' | 'rent' } | null>(null);

  function calculate() {
    const price = parseFloat(propertyPrice) || 0;
    const dpPct = (parseFloat(downPaymentPct) || 20) / 100;
    const downPayment = price * dpPct;
    const loanAmount = price - downPayment;
    const loanMonths = (parseFloat(loanTenure) || 20) * 12;
    const emi = calcEMI(loanAmount, parseFloat(loanRate) || 8.5, loanMonths);

    const simYears = parseFloat(years) || 10;
    const propAppRate = (parseFloat(propertyAppreciation) || 6) / 100;
    const rentIncrRate = (parseFloat(rentIncrement) || 5) / 100;
    const investReturnRate = (parseFloat(investmentReturn) || 10) / 100;

    // Renting: down payment grows at investment return rate
    let cumulativeRent = 0;
    let currentRent = parseFloat(monthlyRent) || 25000;
    let investedAmount = downPayment;
    let cumulativeBuyCost = downPayment; // initial down payment
    let propertyVal = price;

    const yearData: YearData[] = [];
    let breakEvenYear: number | null = null;

    for (let y = 1; y <= simYears; y++) {
      // Buying: EMI × 12, minus property appreciation gain
      const yearEMI = emi * 12;
      propertyVal *= (1 + propAppRate);
      cumulativeBuyCost += yearEMI;
      const buyingNetCost = cumulativeBuyCost - (propertyVal - price); // cost minus appreciation

      // Renting: annual rent + opportunity cost
      cumulativeRent += currentRent * 12;
      investedAmount *= (1 + investReturnRate);
      const rentingNetCost = cumulativeRent - (investedAmount - downPayment); // rent minus investment gains

      currentRent *= (1 + rentIncrRate);

      if (breakEvenYear === null && buyingNetCost < rentingNetCost) {
        breakEvenYear = y;
      }

      yearData.push({ year: y, cumulativeBuyingCost: buyingNetCost, cumulativeRentingCost: rentingNetCost, propertyValue: propertyVal });
    }

    const lastYear = yearData[yearData.length - 1];
    const verdict = lastYear.cumulativeBuyingCost < lastYear.cumulativeRentingCost ? 'buy' : 'rent';
    setResult({ yearData, breakEvenYear, verdict });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🏗️</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Rent vs Buy Calculator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Should you rent or buy a home? Find the break-even point.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-4 lg:sticky lg:top-24">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Property Details</p>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Property Price</label>
              <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={propertyPrice} onChange={e => setPropertyPrice(e.target.value)} className={`${inputCls} pl-8`} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Down Payment %</label>
                <div className="relative"><input type="number" value={downPaymentPct} onChange={e => setDownPaymentPct(e.target.value)} className={`${inputCls} pr-8`} min="10" max="80" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Loan Rate %</label>
                <div className="relative"><input type="number" value={loanRate} onChange={e => setLoanRate(e.target.value)} className={`${inputCls} pr-8`} step="0.1" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Loan Tenure (Yrs)</label>
                <input type="number" value={loanTenure} onChange={e => setLoanTenure(e.target.value)} className={inputCls} min="5" max="30" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Compare Over (Yrs)</label>
                <input type="number" value={years} onChange={e => setYears(e.target.value)} className={inputCls} min="1" max="30" />
              </div>
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2 border-t border-gray-100 dark:border-slate-700">Renting Details</p>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Monthly Rent</label>
              <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={monthlyRent} onChange={e => setMonthlyRent(e.target.value)} className={`${inputCls} pl-8`} /></div>
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2 border-t border-gray-100 dark:border-slate-700">Assumptions</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Rent Hike/yr</label>
                <div className="relative"><input type="number" value={rentIncrement} onChange={e => setRentIncrement(e.target.value)} className={`${inputCls} pr-6`} step="0.5" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span></div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Prop. Appr.</label>
                <div className="relative"><input type="number" value={propertyAppreciation} onChange={e => setPropertyAppreciation(e.target.value)} className={`${inputCls} pr-6`} step="0.5" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span></div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Invest Ret.</label>
                <div className="relative"><input type="number" value={investmentReturn} onChange={e => setInvestmentReturn(e.target.value)} className={`${inputCls} pr-6`} step="0.5" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span></div>
              </div>
            </div>

            <button onClick={calculate} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
              <Calculator className="w-5 h-5" /> Compare Rent vs Buy
            </button>
          </div>

          <div className="space-y-5">
            {result ? (
              <>
                {/* Verdict */}
                <div className={`rounded-2xl p-6 border-2 ${result.verdict === 'buy' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'}`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Verdict (after {years} years)</p>
                  <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
                    {result.verdict === 'buy' ? '🏠 Buying is more cost-effective' : '🏢 Renting is more cost-effective'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {result.breakEvenYear
                      ? `Break-even point: Year ${result.breakEvenYear} — buying becomes cheaper after that`
                      : `Renting is cheaper throughout the ${years}-year comparison period`}
                  </p>
                </div>

                {/* Year-by-year table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Year-by-Year Comparison (Net Cost)</h3>
                    <p className="text-xs text-gray-400 mt-1">Net cost = total outflow minus gains (appreciation for buying, investment returns for renting)</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-slate-700/50">
                          <th className="px-4 py-3 text-left text-gray-500 font-semibold">Year</th>
                          <th className="px-4 py-3 text-right text-gray-500 font-semibold">Net Buy Cost</th>
                          <th className="px-4 py-3 text-right text-gray-500 font-semibold">Net Rent Cost</th>
                          <th className="px-4 py-3 text-right text-gray-500 font-semibold">Property Value</th>
                          <th className="px-4 py-3 text-right text-gray-500 font-semibold">Better</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                        {result.yearData.map(row => {
                          const buyBetter = row.cumulativeBuyingCost < row.cumulativeRentingCost;
                          return (
                            <tr key={row.year} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 font-medium">Yr {row.year}</td>
                              <td className={`px-4 py-2.5 text-right font-semibold ${buyBetter ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>{fmt(row.cumulativeBuyingCost)}</td>
                              <td className={`px-4 py-2.5 text-right font-semibold ${!buyBetter ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{fmt(row.cumulativeRentingCost)}</td>
                              <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-400">{fmt(row.propertyValue)}</td>
                              <td className="px-4 py-2.5 text-right">{buyBetter ? '🏠 Buy' : '🏢 Rent'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-80 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 p-12">
                <span className="text-5xl mb-4">🏗️</span>
                <p className="text-base font-semibold text-gray-400 dark:text-slate-500">Enter details and click Compare</p>
                <p className="text-sm text-gray-300 dark:text-slate-600 mt-1">Find your rent vs buy break-even year</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← All Calculators</Link>
        </div>
      </main>
    </div>
  );
}
