'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import type { CalcCategory } from '@/lib/calculators';

export default function SearchableGrid({ categories }: { categories: CalcCategory[] }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const q = query.toLowerCase().trim();

  const filtered = q
    ? categories.map(cat => ({
        ...cat,
        items: cat.items.filter(
          i => i.status === 'live' && (i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
        ),
      })).filter(cat => cat.items.length > 0)
    : categories;

  const allLiveCount = categories.flatMap(c => c.items).filter(i => i.status === 'live').length;

  return (
    <>
      {/* Search bar */}
      <div className="max-w-xl mx-auto px-4 mb-8 -mt-5">
        <div className="relative shadow-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${allLiveCount} calculators… (e.g. "SIP", "HRA", "tax")`}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {q && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
            {filtered.flatMap(c => c.items).length} result{filtered.flatMap(c => c.items).length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {/* Categories grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 space-y-12">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No calculators found for &ldquo;{query}&rdquo;</p>
            <button onClick={() => setQuery('')} className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Clear search</button>
          </div>
        )}
        {filtered.map(cat => {
          const liveItems = cat.items.filter(i => i.status === 'live');
          const soonItems = cat.items.filter(i => i.status === 'soon');
          const showSoon = !q; // hide "soon" items during search
          return (
            <section key={cat.title}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{cat.title}</h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {liveItems.length} live{showSoon && soonItems.length > 0 ? ` · ${soonItems.length} coming soon` : ''}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {liveItems.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group relative flex flex-col gap-2 p-4 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xl">{item.emoji}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">Live</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">{item.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </Link>
                ))}
                {showSoon && soonItems.map(item => (
                  <div key={item.name} className="relative flex flex-col gap-2 p-4 rounded-xl border bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700/50 opacity-60">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xl grayscale">{item.emoji}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400">Soon</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-snug">{item.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
