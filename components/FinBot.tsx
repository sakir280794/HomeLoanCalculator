'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, RotateCcw, Send } from 'lucide-react';

// ─── Formatters ────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

// ─── Financial Formulas ────────────────────────────────────────────────────────
function calcEMI(principal: number, annualRate: number, years: number) {
  const R = annualRate / 100 / 12;
  const N = years * 12;
  if (R === 0) return principal / N;
  return (principal * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
}

function amortize(principal: number, annualRate: number, years: number, extraMonthly = 0) {
  const R = annualRate / 100 / 12;
  const emi = calcEMI(principal, annualRate, years);
  let balance = principal;
  let months = 0;
  let totalInterest = 0;
  while (balance > 0.5 && months < years * 12 * 3) {
    const interest = balance * R;
    const pay = Math.min(balance + interest, emi + extraMonthly);
    totalInterest += interest;
    balance = balance + interest - pay;
    months++;
  }
  return { months, totalInterest };
}

function sipFV(monthly: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

function sipForGoal(target: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (target * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));
}

function fdMaturity(principal: number, annualRate: number, years: number) {
  return principal * Math.pow(1 + annualRate / 100 / 4, 4 * years);
}

// ─── Scenario Definitions ─────────────────────────────────────────────────────
interface Field {
  key: string;
  label: string;
  defaultVal: string;
  unit: string;
  prefix?: string;
}

interface Scenario {
  key: string;
  chip: string;
  intro: string;
  fields: Field[];
  compute: (v: Record<string, number>) => string;
}

const SCENARIOS: Scenario[] = [
  {
    key: 'extra_payment',
    chip: '💸 Extra monthly payment benefit',
    intro: "Let me show you exactly how much interest and time you save by paying extra each month!",
    fields: [
      { key: 'principal', label: 'Loan Amount', defaultVal: '3000000', unit: '', prefix: '₹' },
      { key: 'rate', label: 'Interest Rate', defaultVal: '8.5', unit: '% p.a.' },
      { key: 'tenure', label: 'Tenure', defaultVal: '20', unit: 'years' },
      { key: 'extra', label: 'Extra Monthly Payment', defaultVal: '5000', unit: '', prefix: '₹' },
    ],
    compute: (v) => {
      const emi = calcEMI(v.principal, v.rate, v.tenure);
      const base = amortize(v.principal, v.rate, v.tenure, 0);
      const boosted = amortize(v.principal, v.rate, v.tenure, v.extra);
      const saved = base.totalInterest - boosted.totalInterest;
      const monthsSaved = base.months - boosted.months;
      const yrs = Math.floor(monthsSaved / 12);
      const mos = monthsSaved % 12;
      const timeStr = yrs > 0 ? `${yrs} yr${yrs > 1 ? 's' : ''} ${mos > 0 ? mos + ' mo' : ''}` : `${mos} months`;
      return [
        `📊 Result for ${fmt(v.principal)} at ${v.rate}% for ${v.tenure} years:`,
        ``,
        `Your base EMI: ${fmt(Math.round(emi))}/month`,
        `With ${fmt(v.extra)} extra: ${fmt(Math.round(emi + v.extra))}/month`,
        ``,
        `💰 Interest saved: ${fmt(Math.round(saved))}`,
        `⏰ Loan closes: ${timeStr} earlier`,
        `📉 Base interest: ${fmt(Math.round(base.totalInterest))}`,
        `📉 New interest: ${fmt(Math.round(boosted.totalInterest))}`,
        ``,
        `💡 Tip: Start extra payments from Month 1 — the earlier, the more you save!`,
      ].join('\n');
    },
  },
  {
    key: 'increase_emi',
    chip: '📈 Increase EMI — close loan early',
    intro: "Tell me your loan details and your target boosted EMI — I'll show exactly when you'll be debt-free!",
    fields: [
      { key: 'principal', label: 'Loan Amount', defaultVal: '3000000', unit: '', prefix: '₹' },
      { key: 'rate', label: 'Interest Rate', defaultVal: '8.5', unit: '% p.a.' },
      { key: 'tenure', label: 'Tenure', defaultVal: '20', unit: 'years' },
      { key: 'target_emi', label: 'Your Target EMI', defaultVal: '35000', unit: '', prefix: '₹' },
    ],
    compute: (v) => {
      const baseEmi = calcEMI(v.principal, v.rate, v.tenure);
      if (v.target_emi <= baseEmi) {
        return `⚠️ Your target EMI (${fmt(v.target_emi)}) must be higher than the minimum EMI (${fmt(Math.round(baseEmi))}). Please enter a larger value.`;
      }
      const extra = v.target_emi - baseEmi;
      const base = amortize(v.principal, v.rate, v.tenure, 0);
      const boosted = amortize(v.principal, v.rate, v.tenure, extra);
      const saved = base.totalInterest - boosted.totalInterest;
      const monthsSaved = base.months - boosted.months;
      const closesInYrs = Math.floor(boosted.months / 12);
      const closesInMos = boosted.months % 12;
      const savedYrs = Math.floor(monthsSaved / 12);
      const savedMos = monthsSaved % 12;
      return [
        `📊 EMI Boost for ${fmt(v.principal)} at ${v.rate}% for ${v.tenure} years:`,
        ``,
        `Minimum EMI: ${fmt(Math.round(baseEmi))}/month`,
        `Boosted EMI: ${fmt(v.target_emi)}/month`,
        `Extra per month: ${fmt(Math.round(extra))}`,
        ``,
        `🎯 Loan closes in: ${closesInYrs} yr${closesInYrs !== 1 ? 's' : ''} ${closesInMos > 0 ? closesInMos + ' mo' : ''} (vs ${v.tenure} years)`,
        `⏰ Time saved: ${savedYrs > 0 ? savedYrs + ' yrs ' : ''}${savedMos > 0 ? savedMos + ' months' : ''}`,
        `💰 Interest saved: ${fmt(Math.round(saved))}`,
        ``,
        `💡 Use our Home Loan Calculator → EMI Booster tab for the full month-by-month schedule!`,
      ].join('\n');
    },
  },
  {
    key: 'emi_calc',
    chip: '🏠 What is my loan EMI?',
    intro: "Enter your loan details and I'll give you the full cost breakdown instantly!",
    fields: [
      { key: 'principal', label: 'Loan Amount', defaultVal: '3000000', unit: '', prefix: '₹' },
      { key: 'rate', label: 'Interest Rate', defaultVal: '8.5', unit: '% p.a.' },
      { key: 'tenure', label: 'Tenure', defaultVal: '20', unit: 'years' },
    ],
    compute: (v) => {
      const emi = calcEMI(v.principal, v.rate, v.tenure);
      const totalPaid = emi * v.tenure * 12;
      const totalInterest = totalPaid - v.principal;
      const ratio = ((totalInterest / v.principal) * 100).toFixed(0);
      return [
        `📊 Loan EMI Breakdown:`,
        ``,
        `🏠 Loan Amount: ${fmt(v.principal)}`,
        `💰 Monthly EMI: ${fmt(Math.round(emi))}`,
        ``,
        `📅 Tenure: ${v.tenure} years (${v.tenure * 12} EMIs)`,
        `💸 Total Interest: ${fmt(Math.round(totalInterest))}`,
        `💳 Total Payment: ${fmt(Math.round(totalPaid))}`,
        `📈 Interest = ${ratio}% of loan amount`,
        ``,
        `💡 You pay ${fmt(Math.round(totalInterest))} extra. Even ₹5,000/month prepayment can save ₹8-12 lakh on this loan!`,
      ].join('\n');
    },
  },
  {
    key: 'lump_prepay',
    chip: '💳 Lump sum prepayment benefit',
    intro: "A lump sum prepayment is one of the best financial moves! Tell me your loan and the amount you can prepay.",
    fields: [
      { key: 'principal', label: 'Loan Amount', defaultVal: '3000000', unit: '', prefix: '₹' },
      { key: 'rate', label: 'Interest Rate', defaultVal: '8.5', unit: '% p.a.' },
      { key: 'tenure', label: 'Tenure', defaultVal: '20', unit: 'years' },
      { key: 'prepay', label: 'Lump Sum Amount', defaultVal: '100000', unit: '', prefix: '₹' },
      { key: 'in_year', label: 'Prepay in Year No.', defaultVal: '1', unit: '' },
    ],
    compute: (v) => {
      const R = v.rate / 100 / 12;
      const emi = calcEMI(v.principal, v.rate, v.tenure);
      // Find balance at prepayment month
      let balance = v.principal;
      const prepayAt = Math.min(v.in_year * 12, v.tenure * 12 - 1);
      for (let i = 0; i < prepayAt; i++) {
        const interest = balance * R;
        balance = balance + interest - emi;
      }
      const remainYears = v.tenure - v.in_year;
      const baseAfter = amortize(Math.max(0, balance), v.rate, Math.max(1, remainYears), 0);
      const newBal = Math.max(0, balance - v.prepay);
      const withPrepay = amortize(newBal, v.rate, Math.max(1, remainYears), 0);
      const saved = baseAfter.totalInterest - withPrepay.totalInterest;
      const monthsSaved = baseAfter.months - withPrepay.months;
      const yrs = Math.floor(monthsSaved / 12);
      const mos = monthsSaved % 12;
      return [
        `📊 Prepayment of ${fmt(v.prepay)} in Year ${v.in_year}:`,
        ``,
        `Balance at prepayment: ${fmt(Math.round(balance))}`,
        `After prepayment: ${fmt(Math.round(newBal))}`,
        ``,
        `💰 Interest saved: ${fmt(Math.round(saved))}`,
        `⏰ Time saved: ${yrs > 0 ? yrs + ' yrs ' : ''}${mos > 0 ? mos + ' months' : ''}`,
        ``,
        `💡 Same ${fmt(v.prepay)} paid in Year 1 saves ~2-3x more than Year 10 — timing is everything!`,
      ].join('\n');
    },
  },
  {
    key: 'fd_vs_sip',
    chip: '🆚 FD vs SIP — which gives more?',
    intro: "Let me show you the real difference between FD safety and SIP growth with your numbers!",
    fields: [
      { key: 'monthly', label: 'Monthly Investment', defaultVal: '5000', unit: '', prefix: '₹' },
      { key: 'years', label: 'Investment Period', defaultVal: '10', unit: 'years' },
      { key: 'fd_rate', label: 'FD Rate', defaultVal: '7', unit: '% p.a.' },
      { key: 'sip_rate', label: 'Expected SIP Return', defaultVal: '12', unit: '% p.a.' },
    ],
    compute: (v) => {
      const invested = v.monthly * v.years * 12;
      const sipCorpus = sipFV(v.monthly, v.sip_rate, v.years);
      const fdCorpus = sipFV(v.monthly, v.fd_rate, v.years); // monthly FD approximation
      const diff = sipCorpus - fdCorpus;
      return [
        `📊 ${fmt(v.monthly)}/month for ${v.years} years:`,
        ``,
        `💰 Total Invested: ${fmt(Math.round(invested))}`,
        ``,
        `🏛️ FD at ${v.fd_rate}% p.a.:`,
        `   Corpus: ${fmt(Math.round(fdCorpus))} | Gains: ${fmt(Math.round(fdCorpus - invested))}`,
        ``,
        `📊 SIP at ${v.sip_rate}% p.a. (estimated):`,
        `   Corpus: ${fmt(Math.round(sipCorpus))} | Gains: ${fmt(Math.round(sipCorpus - invested))}`,
        ``,
        `🏆 SIP gives ${fmt(Math.round(diff))} more over ${v.years} years`,
        ``,
        `💡 SIP for long-term goals (7+ yrs), FD for short-term safety (1-3 yrs). SIP returns not guaranteed.`,
      ].join('\n');
    },
  },
  {
    key: 'sip_goal',
    chip: '🎯 How much to invest for a goal?',
    intro: "Let me reverse-calculate your SIP! Tell me your target and I'll say exactly how much to invest monthly.",
    fields: [
      { key: 'target', label: 'Target Amount', defaultVal: '10000000', unit: '', prefix: '₹' },
      { key: 'years', label: 'Time Available', defaultVal: '20', unit: 'years' },
      { key: 'rate', label: 'Expected Return', defaultVal: '12', unit: '% p.a.' },
    ],
    compute: (v) => {
      const monthly = sipForGoal(v.target, v.rate, v.years);
      const invested = monthly * v.years * 12;
      const gains = v.target - invested;
      const at10 = sipForGoal(v.target, 10, v.years);
      const at15 = sipForGoal(v.target, 15, v.years);
      return [
        `📊 To reach ${fmt(v.target)} in ${v.years} years:`,
        ``,
        `💰 Monthly SIP needed: ${fmt(Math.round(monthly))} at ${v.rate}%`,
        `📈 You invest total: ${fmt(Math.round(invested))}`,
        `💸 Market adds: ${fmt(Math.round(gains))}`,
        ``,
        `📊 Sensitivity (same goal, different returns):`,
        `• At 10%: ${fmt(Math.round(at10))}/month`,
        `• At 12%: ${fmt(Math.round(monthly))}/month`,
        `• At 15%: ${fmt(Math.round(at15))}/month`,
        ``,
        `💡 Starting 5 years earlier roughly halves the monthly amount needed!`,
      ].join('\n');
    },
  },
  {
    key: 'gst',
    chip: '📋 Quick GST calculation',
    intro: "Quick GST in seconds! Tell me your amount and the applicable rate.",
    fields: [
      { key: 'amount', label: 'Amount', defaultVal: '10000', unit: '', prefix: '₹' },
      { key: 'rate', label: 'GST Rate', defaultVal: '18', unit: '%' },
    ],
    compute: (v) => {
      const gst = v.amount * v.rate / 100;
      const cgst = gst / 2;
      const total = v.amount + gst;
      return [
        `📊 GST @ ${v.rate}% on ${fmt(v.amount)}:`,
        ``,
        `🧾 Base Amount: ${fmt(v.amount)}`,
        `📋 Total GST (${v.rate}%): ${fmt(gst)}`,
        `   ├── CGST (${v.rate / 2}%): ${fmt(cgst)}`,
        `   └── SGST (${v.rate / 2}%): ${fmt(cgst)}`,
        ``,
        `💰 Grand Total: ${fmt(total)}`,
        ``,
        `💡 Rates: 5% essentials · 12% mobiles · 18% services · 28% luxury`,
      ].join('\n');
    },
  },
  {
    key: 'gratuity',
    chip: '🤝 Calculate my gratuity',
    intro: "I'll calculate your gratuity per the Payment of Gratuity Act, 1972. Enter your salary and years of service.",
    fields: [
      { key: 'salary', label: 'Last Salary (Basic + DA)', defaultVal: '50000', unit: '', prefix: '₹' },
      { key: 'years', label: 'Years of Service', defaultVal: '10', unit: 'years' },
    ],
    compute: (v) => {
      if (v.years < 5) {
        return `⚠️ Minimum 5 years of service required for gratuity. You have ${v.years} years — you need ${5 - v.years} more year(s) to be eligible.`;
      }
      const gratuity = (15 / 26) * v.salary * v.years;
      const taxFree = 2000000;
      const taxable = Math.max(0, gratuity - taxFree);
      return [
        `📊 Gratuity Calculation:`,
        ``,
        `👔 Last Salary (Basic + DA): ${fmt(v.salary)}`,
        `📅 Years of Service: ${v.years}`,
        `📐 Formula: (15 ÷ 26) × ${fmt(v.salary)} × ${v.years}`,
        ``,
        `🤝 Gratuity Amount: ${fmt(Math.round(gratuity))}`,
        ``,
        `🔖 Tax-free limit: ₹20,00,000`,
        taxable > 0
          ? `⚠️ Taxable portion: ${fmt(Math.round(taxable))}`
          : `✅ Fully tax-exempt (under ₹20 lakh limit)`,
        ``,
        `💡 Applicable for orgs with 10+ employees. Fixed-rate loans may have prepayment charges — floating loans don't!`,
      ].join('\n');
    },
  },
];

// ─── Keyword → Scenario Matching ─────────────────────────────────────────────
function detectIntent(text: string): Scenario | null {
  const t = text.toLowerCase();
  if (t.match(/extra|5000|additional|more.*month/)) return SCENARIOS.find(s => s.key === 'extra_payment') ?? null;
  if (t.match(/increas.*emi|boost.*emi|emi.*increas|higher emi/)) return SCENARIOS.find(s => s.key === 'increase_emi') ?? null;
  if (t.match(/prepay|lump.?sum|part.?pay/)) return SCENARIOS.find(s => s.key === 'lump_prepay') ?? null;
  if (t.match(/emi|monthly.?pay|instalment/)) return SCENARIOS.find(s => s.key === 'emi_calc') ?? null;
  if (t.match(/fd.?vs|sip.?vs|compare.*fd|fd.*sip|fixed.?dep/)) return SCENARIOS.find(s => s.key === 'fd_vs_sip') ?? null;
  if (t.match(/goal|crore|target|how.?much.*invest/)) return SCENARIOS.find(s => s.key === 'sip_goal') ?? null;
  if (t.match(/gst|goods.*service.*tax/)) return SCENARIOS.find(s => s.key === 'gst') ?? null;
  if (t.match(/gratuit/)) return SCENARIOS.find(s => s.key === 'gratuity') ?? null;
  return null;
}

// ─── Message Types ────────────────────────────────────────────────────────────
type Msg =
  | { id: number; role: 'user'; text: string }
  | { id: number; role: 'bot'; text: string }
  | { id: number; role: 'form'; scenario: Scenario }
  | { id: number; role: 'result'; text: string };

let _id = 0;
const uid = () => ++_id;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FinBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [formVals, setFormVals] = useState<Record<string, string>>({});
  const [activeScenarioId, setActiveScenarioId] = useState<number | null>(null);
  const [typing, setTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const push = (...newMsgs: Msg[]) => setMsgs(prev => [...prev, ...newMsgs]);

  useEffect(() => {
    if (open && msgs.length === 0) {
      push({
        id: uid(), role: 'bot',
        text: "Hi! I'm FinBot 🤖 — a rule-based financial advisor.\n\nI use real formulas (not AI) to calculate your exact savings, EMI, returns and more. Pick a scenario below:",
      });
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  const startScenario = (scenario: Scenario, userText: string) => {
    const defaults: Record<string, string> = {};
    scenario.fields.forEach(f => { defaults[f.key] = f.defaultVal; });
    setFormVals(defaults);
    const formId = uid();
    setActiveScenarioId(formId);
    push(
      { id: uid(), role: 'user', text: userText },
      { id: uid(), role: 'bot', text: scenario.intro },
      { id: formId, role: 'form', scenario },
    );
  };

  const handleCalculate = (scenario: Scenario, formMsgId: number) => {
    const vals: Record<string, number> = {};
    for (const f of scenario.fields) {
      const n = parseFloat(formVals[f.key] ?? f.defaultVal);
      if (isNaN(n)) return;
      vals[f.key] = n;
    }
    setActiveScenarioId(null);
    setTyping(true);
    setTimeout(() => {
      const result = scenario.compute(vals);
      setTyping(false);
      // Replace form message with submitted version (mark inactive) and add result
      setMsgs(prev => [
        ...prev.map(m => m.id === formMsgId ? { ...m, submitted: true } : m),
        { id: uid(), role: 'result' as const, text: result },
      ]);
    }, 700);
  };

  const handleTextSend = () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');
    const scenario = detectIntent(text);
    if (scenario) {
      startScenario(scenario, text);
    } else {
      push(
        { id: uid(), role: 'user', text },
        { id: uid(), role: 'bot', text: "I'm best at specific financial scenarios! Try picking one from the suggestions below, or ask about:\n• EMI calculation\n• Extra payment savings\n• FD vs SIP\n• Prepayment benefit\n• Goal-based SIP\n• GST\n• Gratuity" },
      );
    }
  };

  const reset = () => {
    _id = 0;
    setMsgs([{ id: uid(), role: 'bot', text: "Sure! What else would you like to calculate? Pick a scenario below:" }]);
    setActiveScenarioId(null);
    setInputText('');
    setFormVals({});
  };

  const formSubmitted = (msgId: number) => {
    const m = msgs.find(x => x.id === msgId);
    return m && 'submitted' in m && (m as { submitted?: boolean }).submitted === true;
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold shadow-2xl transition-all active:scale-95 ${open ? 'p-2.5 rounded-xl' : 'px-5 py-3 rounded-2xl'}`}
        aria-label="Open FinBot"
      >
        {open ? <X className="w-5 h-5" /> : (
          <>
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">Ask FinBot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base">🤖</div>
              <div>
                <p className="text-white font-bold text-sm leading-none">FinBot</p>
                <p className="text-indigo-200 text-xs mt-0.5">Rule-based Financial Advisor</p>
              </div>
              <span className="text-xs bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-medium">LIVE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={reset} title="New conversation" className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {msgs.map(msg => (
              <div key={msg.id}>
                {msg.role === 'user' && (
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 text-white text-sm px-3.5 py-2.5 rounded-2xl rounded-tr-sm max-w-[82%] leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                )}
                {msg.role === 'bot' && (
                  <div className="bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 text-sm px-3.5 py-2.5 rounded-2xl rounded-tl-sm max-w-[88%] whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>
                )}
                {msg.role === 'result' && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-gray-800 dark:text-gray-200 text-sm px-3.5 py-3 rounded-2xl rounded-tl-sm max-w-[95%] whitespace-pre-line leading-relaxed font-mono text-xs">
                    {msg.text}
                  </div>
                )}
                {msg.role === 'form' && !formSubmitted(msg.id) && (
                  <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl p-3.5 space-y-3">
                    {msg.scenario.fields.map(field => (
                      <div key={field.key}>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{field.label}</label>
                        <div className="relative">
                          {field.prefix && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">{field.prefix}</span>
                          )}
                          <input
                            type="number"
                            value={formVals[field.key] ?? field.defaultVal}
                            onChange={e => setFormVals(prev => ({ ...prev, [field.key]: e.target.value }))}
                            className={`w-full text-sm border border-gray-200 dark:border-slate-600 rounded-xl py-2 px-3 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${field.prefix ? 'pl-6' : ''} ${field.unit ? 'pr-14' : ''}`}
                          />
                          {field.unit && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">{field.unit}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {activeScenarioId === msg.id && (
                      <button
                        onClick={() => handleCalculate(msg.scenario, msg.id)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                      >
                        Calculate →
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex items-center gap-1 pl-1 py-2">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested chips */}
          {!activeScenarioId && !typing && (
            <div className="border-t border-gray-100 dark:border-slate-700 px-3 py-2.5 shrink-0">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">Scenarios</p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {SCENARIOS.map(s => (
                  <button
                    key={s.key}
                    onClick={() => startScenario(s, s.chip)}
                    className="text-xs bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 px-2.5 py-1.5 rounded-xl transition-colors text-left leading-snug"
                  >
                    {s.chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Text input */}
          <div className="border-t border-gray-100 dark:border-slate-700 px-3 py-2.5 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTextSend()}
              placeholder="Type a question…"
              className="flex-1 text-sm border border-gray-200 dark:border-slate-600 rounded-xl px-3 py-2 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
            />
            <button
              onClick={handleTextSend}
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
