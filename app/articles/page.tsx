import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { articles } from '@/lib/articles';
import { ChevronRight, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Loan Articles & Guides',
  description: 'Expert articles on home loan prepayment, EMI strategies, interest saving tips, and smart borrowing — written for Indian home loan borrowers.',
};

const categoryBg: Record<string, string> = {
  Strategy: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
  Prepayment: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  Tips: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
};

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 dark:text-gray-200">Articles</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Home Loan Articles & Guides
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base mb-10 max-w-2xl">
          Practical guides on prepayment strategies, EMI optimisation, and smart home loan planning — backed by real numbers.
        </p>

        <div className="space-y-5">
          {articles.map(article => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group block bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryBg[article.category] ?? categoryBg.Tips}`}>
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {article.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 dark:text-slate-600 group-hover:text-indigo-500 shrink-0 mt-1 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
