import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { articles, getArticleBySlug } from '@/lib/articles';
import { ChevronRight, Clock, ArrowLeft, ArrowRight, Calculator } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

const categoryBg: Record<string, string> = {
  Strategy: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
  Prepayment: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  Tips: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const otherArticles = articles.filter(a => a.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/articles" className="hover:text-indigo-600 dark:hover:text-indigo-400">Articles</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 dark:text-gray-200 truncate">{article.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryBg[article.category] ?? categoryBg.Tips}`}>
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed border-l-4 border-indigo-400 pl-4">
            {article.intro}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {article.sections.map((section, i) => (
            <section key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{section.heading}</h2>
              <div className="space-y-3">
                {section.content.map((para, j) => (
                  <p key={j} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Conclusion */}
        <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-200 mb-2">Key Takeaway</h3>
          <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed">{article.conclusion}</p>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Try it with your own numbers</h3>
          <p className="text-indigo-200 text-sm mb-4">Model these strategies in our free calculator.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-sm"
          >
            <Calculator className="w-4 h-4" />
            Open Calculator
          </Link>
        </div>

        {/* Other articles */}
        {otherArticles.length > 0 && (
          <div className="mt-10">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">More Articles</h3>
            <div className="space-y-3">
              {otherArticles.map(a => (
                <Link
                  key={a.slug}
                  href={`/articles/${a.slug}`}
                  className="group flex items-center justify-between gap-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {a.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-slate-600 group-hover:text-indigo-500 shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all articles
          </Link>
        </div>
      </main>
    </div>
  );
}
