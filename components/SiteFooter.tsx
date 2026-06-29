import Link from 'next/link';

const links = {
  Calculators: [
    { label: 'Home Loan EMI', href: '/home-loan' },
    { label: 'SIP Calculator', href: '/sip-calculator' },
    { label: 'FD Calculator', href: '/fd-calculator' },
    { label: 'Income Tax', href: '/income-tax' },
    { label: 'GST Calculator', href: '/gst-calculator' },
    { label: 'Retirement', href: '/retirement' },
    { label: 'All Calculators', href: '/' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
  'Quick Tools': [
    { label: 'HRA Calculator', href: '/hra-calculator' },
    { label: 'NPS Calculator', href: '/nps-calculator' },
    { label: 'CAGR Calculator', href: '/cagr-calculator' },
    { label: 'Rent vs Buy', href: '/rent-vs-buy' },
    { label: 'Child Education', href: '/child-education' },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🧮</span>
              <span className="text-lg font-extrabold text-gray-900 dark:text-gray-100">FinCalc India</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed mb-4">
              India&apos;s free financial calculator hub. 24+ calculators for loans, investments, tax, and retirement planning.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full font-semibold">RBI-verified formulas</span>
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-full font-semibold">FY 2025-26</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">{section}</h3>
              <ul className="space-y-2.5">
                {items.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-xs text-gray-400 dark:text-gray-500">
            <span>© 2026 FinCalc India. All rights reserved.</span>
            <Link href="/privacy" className="hover:text-indigo-500 transition-colors">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-indigo-500 transition-colors">Disclaimer</Link>
            <Link href="/about" className="hover:text-indigo-500 transition-colors">About</Link>
          </div>
          <p className="text-xs text-gray-300 dark:text-gray-600 text-center sm:text-right">
            Results are estimates. Always verify with your financial institution or advisor.
          </p>
        </div>
      </div>
    </footer>
  );
}
