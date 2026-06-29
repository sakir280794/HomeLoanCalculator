'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Moon, Sun, Calculator } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Calculator' },
  { href: '/guide', label: 'How to Use' },
  { href: '/articles', label: 'Articles' },
  { href: '/tips', label: 'Loan Tips' },
];

export default function SiteHeader() {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('darkMode', String(next));
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="bg-white/20 p-2 rounded-xl">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-bold text-white leading-none">Home Loan Calculator</p>
            <p className="text-indigo-200 text-xs mt-0.5">Plan your dream home financing</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-white/25 text-white'
                  : 'text-indigo-100 hover:bg-white/15 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Dark mode */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
