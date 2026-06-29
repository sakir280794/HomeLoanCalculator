import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface Crumb { label: string; href?: string }

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-4 flex-wrap">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3 h-3 shrink-0" />}
          {c.href ? (
            <Link href={c.href} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {c.label}
            </Link>
          ) : (
            <span className="text-gray-600 dark:text-gray-300 font-medium">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
