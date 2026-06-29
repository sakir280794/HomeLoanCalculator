import type { AmortizationRow } from '@/types';

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatCompactCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '₹0';
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${Math.round(value)}`;
}

export function formatMonthYear(month: number, year: number): string {
  return `${MONTH_SHORT[month - 1]} ${year}`;
}

export function exportToCSV(schedule: AmortizationRow[]): void {
  const headers = ['Month', 'EMI (₹)', 'Principal (₹)', 'Interest (₹)', 'Prepayment (₹)', 'Balance (₹)'];
  const rows = schedule.map(r => [
    formatMonthYear(r.calendarMonth, r.calendarYear),
    Math.round(r.emi),
    Math.round(r.principal),
    Math.round(r.interest),
    Math.round(r.prepayment),
    Math.round(r.balance),
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'amortization-schedule.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportToPDF(
  schedule: AmortizationRow[],
  summary: { loanAmount: number; emi: number; totalInterest: number; totalPayment: number }
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(18);
  doc.setTextColor(79, 70, 229);
  doc.text('Home Loan Amortization Schedule', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const summaryLines = [
    `Loan Amount: ${formatCurrency(summary.loanAmount)}`,
    `Monthly EMI: ${formatCurrency(summary.emi)}`,
    `Total Interest: ${formatCurrency(summary.totalInterest)}`,
    `Total Payment: ${formatCurrency(summary.totalPayment)}`,
  ];
  summaryLines.forEach((line, i) => doc.text(line, 14, 32 + i * 7));

  autoTable(doc, {
    head: [['Month', 'EMI (₹)', 'Principal (₹)', 'Interest (₹)', 'Prepayment (₹)', 'Balance (₹)']],
    body: schedule.map(r => [
      formatMonthYear(r.calendarMonth, r.calendarYear),
      Math.round(r.emi).toLocaleString('en-IN'),
      Math.round(r.principal).toLocaleString('en-IN'),
      Math.round(r.interest).toLocaleString('en-IN'),
      Math.round(r.prepayment).toLocaleString('en-IN'),
      Math.round(r.balance).toLocaleString('en-IN'),
    ]),
    startY: 62,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 255] },
  });

  doc.save('amortization-schedule.pdf');
}
