import Link from 'next/link';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import { categories } from '@/lib/calculators';

export const metadata: Metadata = {
  title: 'FinCalc India — Free Financial Calculators',
  description: 'All-in-one financial calculator platform. Home loan, personal loan, FD, SIP, PPF, GST, compound interest and 60+ calculators — free, accurate, and India-focused.',
};

const colorMap: Record<string, { bg: string; text: string; badge: string; border: string }> = {
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300', badge: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-300', badge: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  teal: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-700 dark:text-teal-300', badge: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300', badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-700 dark:text-cyan-300', badge: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
  slate: { bg: 'bg-slate-50 dark:bg-slate-800/50', text: 'text-slate-700 dark:text-slate-300', badge: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-300', badge: 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800' },
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
          <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
            {liveCount} live calculators · {totalCount}+ coming — loans, investments, tax, retirement &amp; more
          </p>
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

      {/* Categories */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {categories.map(cat => {
          const c = colorMap[cat.color] ?? colorMap.indigo;
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
