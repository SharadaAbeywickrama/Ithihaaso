'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: '🏛️' },
    { href: '/upload', label: 'Upload Documents', icon: '📄' },
    { href: '/graph', label: 'Knowledge Graph', icon: '🕸️' },
    { href: '/query', label: 'AI Query Agent', icon: '🧠' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/40 flex items-center justify-center text-xl group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all">
            🏛️
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight gold-gradient-text">
              ITHIHAASO
            </span>
            <span className="text-[10px] tracking-widest text-amber-500/70 uppercase font-mono -mt-1">
              Historiographical AI
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span className="hidden md:inline">{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full shadow-[0_0_6px_#F59E0B]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

