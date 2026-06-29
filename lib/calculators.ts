export type CalcStatus = 'live' | 'soon';

export interface CalcItem {
  name: string;
  desc: string;
  href: string;
  status: CalcStatus;
  emoji: string;
}

export interface CalcCategory {
  title: string;
  emoji: string;
  color: string;
  items: CalcItem[];
}

export const categories: CalcCategory[] = [
  {
    title: 'Loan Calculators',
    emoji: '🏦',
    color: 'indigo',
    items: [
      { name: 'Home Loan EMI Calculator', desc: 'EMI, prepayment, top-up, EMI booster & amortization', href: '/home-loan', status: 'live', emoji: '🏠' },
      { name: 'Personal Loan EMI Calculator', desc: 'Calculate EMI for personal loans instantly', href: '/personal-loan', status: 'live', emoji: '👤' },
      { name: 'Car Loan EMI Calculator', desc: 'Plan your car loan EMI and total cost', href: '/car-loan', status: 'live', emoji: '🚗' },
      { name: 'Bike Loan EMI Calculator', desc: 'Two-wheeler loan EMI made simple', href: '/bike-loan', status: 'live', emoji: '🏍️' },
      { name: 'Education Loan EMI Calculator', desc: 'Student loan EMI and repayment planner', href: '/education-loan', status: 'live', emoji: '🎓' },
      { name: 'Business Loan EMI Calculator', desc: 'SME & business loan EMI calculator', href: '/business-loan', status: 'live', emoji: '💼' },
      { name: 'Generic EMI Calculator', desc: 'Universal EMI calculator for any loan', href: '/emi-calculator', status: 'live', emoji: '🧮' },
      { name: 'Gold Loan Calculator', desc: 'Calculate gold loan amount and EMI', href: '/gold-loan', status: 'soon', emoji: '🥇' },
      { name: 'Loan Against Property (LAP)', desc: 'Mortgage loan EMI and eligibility', href: '/lap-calculator', status: 'soon', emoji: '🏗️' },
      { name: 'Balance Transfer Calculator', desc: 'See savings from transferring your loan', href: '/balance-transfer', status: 'soon', emoji: '🔄' },
      { name: 'Loan Eligibility Calculator', desc: 'Check how much loan you qualify for', href: '/loan-eligibility', status: 'soon', emoji: '✅' },
      { name: 'Foreclosure Calculator', desc: 'Calculate foreclosure amount and savings', href: '/foreclosure', status: 'soon', emoji: '🔒' },
      { name: 'Working Capital Loan', desc: 'Working capital EMI and cash flow', href: '/working-capital', status: 'soon', emoji: '🏭' },
    ],
  },
  {
    title: 'Investment Calculators',
    emoji: '📈',
    color: 'emerald',
    items: [
      { name: 'Fixed Deposit (FD) Calculator', desc: 'Maturity amount with compound interest', href: '/fd-calculator', status: 'live', emoji: '🏛️' },
      { name: 'SIP Calculator', desc: 'Mutual fund SIP growth estimator', href: '/sip-calculator', status: 'live', emoji: '📊' },
      { name: 'Lumpsum Investment Calculator', desc: 'One-time investment growth calculator', href: '/lumpsum-calculator', status: 'live', emoji: '💰' },
      { name: 'PPF Calculator', desc: 'Public Provident Fund maturity calculator', href: '/ppf-calculator', status: 'live', emoji: '🏦' },
      { name: 'Recurring Deposit (RD) Calculator', desc: 'Monthly RD maturity and interest', href: '/rd-calculator', status: 'live', emoji: '📅' },
      { name: 'Mutual Fund Calculator', desc: 'Estimate mutual fund returns', href: '/mutual-fund', status: 'soon', emoji: '📉' },
      { name: 'SWP Calculator', desc: 'Systematic Withdrawal Plan calculator', href: '/swp-calculator', status: 'soon', emoji: '💸' },
      { name: 'STP Calculator', desc: 'Systematic Transfer Plan planner', href: '/stp-calculator', status: 'soon', emoji: '🔁' },
    ],
  },
  {
    title: 'Government Schemes',
    emoji: '🇮🇳',
    color: 'amber',
    items: [
      { name: 'EPF Calculator', desc: 'Employee Provident Fund corpus calculator', href: '/epf-calculator', status: 'soon', emoji: '👷' },
      { name: 'NPS Calculator', desc: 'National Pension System returns', href: '/nps-calculator', status: 'live', emoji: '🏛️' },
      { name: 'Sukanya Samriddhi Yojana (SSY)', desc: 'SSY maturity amount for girl child', href: '/ssy-calculator', status: 'soon', emoji: '👧' },
      { name: 'NSC Calculator', desc: 'National Savings Certificate returns', href: '/nsc-calculator', status: 'soon', emoji: '📜' },
      { name: 'Kisan Vikas Patra (KVP)', desc: 'KVP doubling period and maturity', href: '/kvp-calculator', status: 'soon', emoji: '🌾' },
      { name: 'SCSS Calculator', desc: 'Senior Citizens Savings Scheme returns', href: '/scss-calculator', status: 'soon', emoji: '👴' },
      { name: 'Atal Pension Yojana (APY)', desc: 'APY pension amount estimator', href: '/apy-calculator', status: 'soon', emoji: '🏅' },
    ],
  },
  {
    title: 'Tax Calculators',
    emoji: '🧾',
    color: 'rose',
    items: [
      { name: 'GST Calculator', desc: 'Calculate GST, CGST, SGST on any amount', href: '/gst-calculator', status: 'live', emoji: '📋' },
      { name: 'Income Tax Calculator', desc: 'Old vs new tax regime comparison FY 2025-26', href: '/income-tax', status: 'live', emoji: '🧮' },
      { name: 'HRA Calculator', desc: 'House Rent Allowance exemption calculator', href: '/hra-calculator', status: 'live', emoji: '🏠' },
      { name: 'Capital Gains Tax Calculator', desc: 'STCG and LTCG tax estimator', href: '/capital-gains', status: 'soon', emoji: '📈' },
    ],
  },
  {
    title: 'Interest Calculators',
    emoji: '💹',
    color: 'purple',
    items: [
      { name: 'Compound Interest Calculator', desc: 'Growth with compounding frequency options', href: '/compound-interest', status: 'live', emoji: '📐' },
      { name: 'Simple Interest Calculator', desc: 'Quick simple interest and total amount', href: '/simple-interest', status: 'live', emoji: '📏' },
      { name: 'CAGR Calculator', desc: 'Compound Annual Growth Rate calculator', href: '/cagr-calculator', status: 'live', emoji: '📈' },
      { name: 'Interest Rate Calculator', desc: 'Find the implicit interest rate on a loan', href: '/interest-rate', status: 'soon', emoji: '🔢' },
      { name: 'Loan Tenure Calculator', desc: 'Find tenure for a given EMI and rate', href: '/loan-tenure', status: 'soon', emoji: '📆' },
      { name: 'Amortization Schedule', desc: 'Detailed month-by-month schedule', href: '/home-loan', status: 'live', emoji: '📋' },
    ],
  },
  {
    title: 'Retirement & Pension',
    emoji: '🎯',
    color: 'teal',
    items: [
      { name: 'Gratuity Calculator', desc: 'Calculate gratuity as per Payment of Gratuity Act', href: '/gratuity-calculator', status: 'live', emoji: '🤝' },
      { name: 'Retirement Calculator', desc: 'How much corpus do you need to retire?', href: '/retirement', status: 'live', emoji: '🌅' },
      { name: 'Pension Calculator', desc: 'Monthly pension from your corpus', href: '/pension', status: 'soon', emoji: '📆' },
    ],
  },
  {
    title: 'Property Calculators',
    emoji: '🏗️',
    color: 'orange',
    items: [
      { name: 'Rent vs Buy Calculator', desc: 'Should you rent or buy? Find break-even year', href: '/rent-vs-buy', status: 'live', emoji: '🏗️' },
      { name: 'Stamp Duty Calculator', desc: 'Estimate stamp duty by state and value', href: '/stamp-duty', status: 'soon', emoji: '📑' },
      { name: 'Property Registration Charges', desc: 'Registration fee and total property cost', href: '/property-registration', status: 'soon', emoji: '🖋️' },
    ],
  },
  {
    title: 'Credit Card',
    emoji: '💳',
    color: 'cyan',
    items: [
      { name: 'Credit Card EMI Calculator', desc: 'Convert purchases to EMI and see cost', href: '/cc-emi', status: 'soon', emoji: '💳' },
      { name: 'Credit Card Interest Calculator', desc: 'True cost of revolving credit card debt', href: '/cc-interest', status: 'soon', emoji: '📊' },
      { name: 'Minimum Payment Calculator', desc: 'How long to clear debt with min pay', href: '/cc-min-payment', status: 'soon', emoji: '⏳' },
      { name: 'Debt-to-Income (DTI) Calculator', desc: 'Check your debt burden ratio', href: '/dti-calculator', status: 'soon', emoji: '⚖️' },
    ],
  },
  {
    title: 'Salary & Income',
    emoji: '💼',
    color: 'slate',
    items: [
      { name: 'Salary Calculator', desc: 'In-hand salary from CTC breakdown', href: '/salary-calculator', status: 'soon', emoji: '💰' },
      { name: 'HRA Calculator', desc: 'Calculate HRA exemption for tax', href: '/hra-calculator', status: 'soon', emoji: '🏘️' },
      { name: 'Leave Encashment Calculator', desc: 'Calculate leave encashment payout', href: '/leave-encashment', status: 'soon', emoji: '📅' },
    ],
  },
  {
    title: 'Financial Planning',
    emoji: '🗺️',
    color: 'violet',
    items: [
      { name: 'Savings Goal Calculator', desc: 'How much to save monthly for your goal', href: '/savings-goal', status: 'soon', emoji: '🎯' },
      { name: 'Emergency Fund Calculator', desc: 'How large should your emergency fund be?', href: '/emergency-fund', status: 'soon', emoji: '🛡️' },
      { name: 'Inflation Calculator', desc: 'Future value of money after inflation', href: '/inflation', status: 'soon', emoji: '📉' },
      { name: 'Child Education Planner', desc: 'Save for your child\'s education corpus', href: '/child-education', status: 'live', emoji: '🎓' },
      { name: 'Marriage Planning Calculator', desc: 'Plan your wedding expenses and savings', href: '/marriage-planning', status: 'soon', emoji: '💍' },
      { name: 'Net Worth Calculator', desc: 'Assets minus liabilities = net worth', href: '/net-worth', status: 'soon', emoji: '💎' },
      { name: 'Wealth Creation Calculator', desc: 'Model your wealth over time', href: '/wealth-creation', status: 'soon', emoji: '🚀' },
      { name: 'Currency Exchange Calculator', desc: 'Real-time currency conversion rates', href: '/currency-exchange', status: 'soon', emoji: '💱' },
    ],
  },
];

export const liveCalculators = categories.flatMap(c => c.items).filter(i => i.status === 'live');
