'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, formatMonthYear, exportToCSV, exportToPDF } from '@/lib/utils';
import type { AmortizationRow, CompleteLoanResult, LoanSummary } from '@/types';
import { ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';

type TabId = 'base' | 'prep' | 'boost' | 'combined' | 'topup';

interface TabConfig {
  id: TabId;
  label: string;
  activeCls: string;
  hoverCls: string;
  principalCls: string;
  showPrepCol: boolean;
}

interface Props {
  result: CompleteLoanResult;
  loanAmount: number;
  emi: number;
  totalInterest: number;
  totalPayment: number;
  topUpSchedule?: AmortizationRow[];
  topUpSummary?: { loanAmount: number; emi: number; totalInterest: number; totalPayment: number };
  boostSummary?: LoanSummary;
  combinedSummary?: LoanSummary;
}

const PAGE_SIZE = 12;

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let p: number;
          if (totalPages <= 5) p = i + 1;
          else if (page <= 3) p = i + 1;
          else if (page >= totalPages - 2) p = totalPages - 4 + i;
          else p = page - 2 + i;
          return (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                p === page
                  ? 'bg-indigo-600 text-white'
                  : 'border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
}

function TableView({
  rows, page, onPage, hoverCls, principalCls, showPrepCol,
}: {
  rows: AmortizationRow[];
  page: number;
  onPage: (p: number) => void;
  hoverCls: string;
  principalCls: string;
  showPrepCol: boolean;
}) {
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const headers = showPrepCol
    ? ['Month', 'EMI', 'Principal', 'Interest', 'Prepayment', 'Balance']
    : ['Month', 'EMI', 'Principal', 'Interest', 'Balance'];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700/50">
              {headers.map(h => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide first:rounded-l-lg last:rounded-r-lg"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr
                key={row.monthNumber}
                className={`border-b border-gray-100 dark:border-slate-700/50 transition-colors ${hoverCls} ${
                  i % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-slate-800/50'
                }`}
              >
                <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                  {formatMonthYear(row.calendarMonth, row.calendarYear)}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-gray-700 dark:text-gray-300">
                  {formatCurrency(row.emi)}
                </td>
                <td className={`px-4 py-2.5 tabular-nums font-medium ${principalCls}`}>
                  {formatCurrency(row.principal)}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-amber-600 dark:text-amber-400">
                  {formatCurrency(row.interest)}
                </td>
                {showPrepCol && (
                  <td className="px-4 py-2.5 tabular-nums text-emerald-600 dark:text-emerald-400">
                    {row.prepayment > 0 ? formatCurrency(row.prepayment) : <span className="text-gray-300 dark:text-slate-600">—</span>}
                  </td>
                )}
                <td className="px-4 py-2.5 tabular-nums text-gray-600 dark:text-gray-400">
                  {formatCurrency(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 px-1">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, rows.length)} of {rows.length} payments
        </p>
        <Pagination page={page} totalPages={totalPages} onPage={onPage} />
      </div>
    </>
  );
}

function SummaryBanner({
  items, colorCls,
}: {
  items: { label: string; value: string }[];
  colorCls: { bg: string; border: string; label: string; value: string };
}) {
  return (
    <div className={`flex flex-wrap gap-4 ${colorCls.bg} border ${colorCls.border} rounded-xl px-4 py-3 mb-4 text-xs`}>
      {items.map(s => (
        <div key={s.label}>
          <span className={`${colorCls.label} font-medium`}>{s.label}: </span>
          <span className={`font-bold ${colorCls.value} tabular-nums`}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AmortizationTable({
  result, loanAmount, emi, totalInterest, totalPayment,
  topUpSchedule, topUpSummary, boostSummary, combinedSummary,
}: Props) {
  const hasPrepayment = !!result.withPrepayment;
  const hasBoost = !!boostSummary;
  const hasCombined = !!combinedSummary;
  const hasTopUp = !!topUpSchedule?.length;

  const tabs: TabConfig[] = [
    {
      id: 'base', label: 'Standard',
      activeCls: 'bg-indigo-600', hoverCls: 'hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10',
      principalCls: 'text-indigo-600 dark:text-indigo-400', showPrepCol: true,
    },
    ...(hasPrepayment ? [{
      id: 'prep' as TabId, label: 'With Prepayment',
      activeCls: 'bg-indigo-600', hoverCls: 'hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10',
      principalCls: 'text-indigo-600 dark:text-indigo-400', showPrepCol: true,
    }] : []),
    ...(hasBoost ? [{
      id: 'boost' as TabId, label: 'EMI Boosted',
      activeCls: 'bg-amber-500', hoverCls: 'hover:bg-amber-50/40 dark:hover:bg-amber-900/10',
      principalCls: 'text-amber-600 dark:text-amber-400', showPrepCol: false,
    }] : []),
    ...(hasCombined ? [{
      id: 'combined' as TabId, label: 'Combined',
      activeCls: 'bg-emerald-600', hoverCls: 'hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10',
      principalCls: 'text-emerald-600 dark:text-emerald-400', showPrepCol: true,
    }] : []),
    ...(hasTopUp ? [{
      id: 'topup' as TabId, label: 'Top-up Loan',
      activeCls: 'bg-purple-600', hoverCls: 'hover:bg-purple-50/40 dark:hover:bg-purple-900/10',
      principalCls: 'text-purple-600 dark:text-purple-400', showPrepCol: false,
    }] : []),
  ];

  const [activeTab, setActiveTab] = useState<TabId>('base');
  const [pages, setPages] = useState<Record<TabId, number>>({ base: 1, prep: 1, boost: 1, combined: 1, topup: 1 });

  useEffect(() => {
    if (!tabs.find(t => t.id === activeTab)) setActiveTab('base');
  }, [hasPrepayment, hasBoost, hasCombined, hasTopUp]); // eslint-disable-line react-hooks/exhaustive-deps

  const setPage = (tab: TabId, p: number) => setPages(prev => ({ ...prev, [tab]: p }));

  const activeConfig = tabs.find(t => t.id === activeTab) ?? tabs[0];

  const activeSchedule =
    activeTab === 'prep' && result.withPrepayment ? result.withPrepayment.schedule
    : activeTab === 'boost' && boostSummary ? boostSummary.schedule
    : activeTab === 'combined' && combinedSummary ? combinedSummary.schedule
    : activeTab === 'topup' && topUpSchedule ? topUpSchedule
    : result.base.schedule;

  const exportSummary =
    activeTab === 'topup' && topUpSummary ? topUpSummary
    : { loanAmount, emi, totalInterest, totalPayment };

  const [exporting, setExporting] = useState(false);
  const handleExportCSV = () => exportToCSV(activeSchedule);
  const handleExportPDF = async () => {
    setExporting(true);
    try { await exportToPDF(activeSchedule, exportSummary); }
    finally { setExporting(false); }
  };

  const baseMonths = result.base.tenureMonths;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Amortization Schedule</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {activeSchedule.length} monthly payments
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          {tabs.length > 1 && (
            <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600 text-xs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? `${tab.activeCls} text-white`
                      : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-60"
          >
            <FileText className="w-3.5 h-3.5" /> {exporting ? 'Exporting…' : 'PDF'}
          </button>
        </div>
      </div>

      {/* Boost summary banner */}
      {activeTab === 'boost' && boostSummary && (
        <SummaryBanner
          colorCls={{
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-100 dark:border-amber-800',
            label: 'text-amber-600 dark:text-amber-400',
            value: 'text-amber-700 dark:text-amber-300',
          }}
          items={[
            { label: 'Boosted EMI', value: formatCurrency(boostSummary.emi) },
            { label: 'Months Saved', value: `${baseMonths - boostSummary.tenureMonths} months` },
            { label: 'Interest Saved', value: formatCurrency(result.base.totalInterest - boostSummary.totalInterest) },
            { label: 'Pays Off', value: formatMonthYear(boostSummary.payoffMonth, boostSummary.payoffYear) },
          ]}
        />
      )}

      {/* Combined summary banner */}
      {activeTab === 'combined' && combinedSummary && (
        <SummaryBanner
          colorCls={{
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-100 dark:border-emerald-800',
            label: 'text-emerald-600 dark:text-emerald-400',
            value: 'text-emerald-700 dark:text-emerald-300',
          }}
          items={[
            { label: 'Boosted EMI', value: formatCurrency(combinedSummary.emi) },
            { label: 'Months Saved', value: `${baseMonths - combinedSummary.tenureMonths} months` },
            { label: 'Interest Saved', value: formatCurrency(result.base.totalInterest - combinedSummary.totalInterest) },
            { label: 'Pays Off', value: formatMonthYear(combinedSummary.payoffMonth, combinedSummary.payoffYear) },
          ]}
        />
      )}

      {/* Top-up summary banner */}
      {activeTab === 'topup' && topUpSummary && (
        <SummaryBanner
          colorCls={{
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            border: 'border-purple-100 dark:border-purple-800',
            label: 'text-purple-500 dark:text-purple-400',
            value: 'text-purple-700 dark:text-purple-300',
          }}
          items={[
            { label: 'Loan Amount', value: formatCurrency(topUpSummary.loanAmount) },
            { label: 'EMI', value: formatCurrency(topUpSummary.emi) },
            { label: 'Total Interest', value: formatCurrency(topUpSummary.totalInterest) },
            { label: 'Total Payment', value: formatCurrency(topUpSummary.totalPayment) },
          ]}
        />
      )}

      <TableView
        key={activeTab}
        rows={activeSchedule}
        page={pages[activeTab]}
        onPage={p => setPage(activeTab, p)}
        hoverCls={activeConfig.hoverCls}
        principalCls={activeConfig.principalCls}
        showPrepCol={activeConfig.showPrepCol}
      />
    </div>
  );
}
