import Link from 'next/link';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import { categories } from '@/lib/calculators';
import { Star, ArrowRight, Calculator, TrendingDown, Zap, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FinCalc India — Free Financial Calculators',
  description: 'All-in-one financial calculator platform. Home loan, personal loan, FD, SIP, PPF, GST, compound interest and 60+ calculators — free, accurate, and India-focused.',
};


export default function HubPage() {
  const liveCount = categories.flatMap(c => c.items).filter(i => i.status === 'live').length;
  const totalCount = categories.flatMap(c => c.items).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            🇮🇳 India&apos;s Free Financial Calculator Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            FinCalc India
          </h1>
          <p className="text-indigo-200 text-lg mb-6 max-w-2xl mx-auto">
            {liveCount} live calculators · {totalCount}+ coming — loans, investments, tax, retirement &amp; more
          </p>
          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: '✅', label: `${liveCount} Free Calculators` },
              { icon: '⚡', label: 'Instant Results' },
              { icon: '🔒', label: 'No Signup' },
              { icon: '📱', label: 'Mobile Friendly' },
              { icon: '🇮🇳', label: 'India-Focused' },
            ].map(t => (
              <span key={t.label} className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {t.icon} {t.label}
              </span>
            ))}
          </div>
          {/* Featured quick links */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: '🏠 Home Loan', href: '/home-loan' },
              { label: '👤 Personal Loan', href: '/personal-loan' },
              { label: '🏛️ FD Calculator', href: '/fd-calculator' },
              { label: '📊 SIP Calculator', href: '/sip-calculator' },
              { label: '📋 GST Calculator', href: '/gst-calculator' },
              { label: '📐 Compound Interest', href: '/compound-interest' },
            ].map(q => (
              <Link
                key={q.href}
                href={q.href}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-xl transition-colors"
              >
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured: Home Loan Calculator ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Flagship Calculator</span>
        </div>
        <Link
          href="/home-loan"
          className="group block bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 rounded-2xl p-7 sm:p-10 hover:shadow-2xl hover:scale-[1.01] transition-all duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">🏠</span>
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Most Comprehensive</p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">Home Loan Calculator</h2>
                </div>
              </div>
              <p className="text-indigo-200 text-sm sm:text-base mb-6 max-w-xl">
                India&apos;s most complete home loan planning tool — calculate EMI, model prepayments, boost your EMI, add a top-up loan, and see the full amortization schedule month by month.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: Calculator, label: 'EMI Calculator' },
                  { icon: TrendingDown, label: 'Prepayment Planner' },
                  { icon: Zap, label: 'EMI Booster' },
                  { icon: Building2, label: 'Top-Up Loan' },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                    <f.icon className="w-4 h-4 text-indigo-200 shrink-0" />
                    <span className="text-xs font-semibold text-white">{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-xl group-hover:bg-indigo-50 transition-colors">
                Open Calculator <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <div className="hidden sm:flex flex-col gap-2 text-right shrink-0">
              {['EMI', 'Total Interest', 'Prepayment Savings', 'Amortization Table'].map(tag => (
                <span key={tag} className="text-xs font-medium text-indigo-200 bg-white/10 px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </Link>
      </div>

      {/* Categories */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {categories.map(cat => {
          return (
            <section key={cat.title}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{cat.title}</h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {cat.items.filter(i => i.status === 'live').length} live · {cat.items.filter(i => i.status === 'soon').length} coming soon
                  </p>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {cat.items.map(item => (
                  item.status === 'live' ? (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group relative flex flex-col gap-2 p-4 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xl">{item.emoji}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                          Live
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={item.name}
                      className="relative flex flex-col gap-2 p-4 rounded-xl border bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700/50 opacity-70"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xl grayscale">{item.emoji}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400">
                          Soon
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-snug">{item.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="mt-8 py-8 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Built by <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Sakirhusain Syed</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Results are indicative. Always verify with your financial institution.</p>
        </div>
      </footer>
    </div>
  );
}
