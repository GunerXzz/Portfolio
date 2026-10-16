'use client';

import * as React from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState('');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const updateClock = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Phnom_Penh',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date());
        setCurrentTime(`${timeStr} ICT`);
      } catch {
        setCurrentTime('Phnom Penh');
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { label: 'Capabilities', href: '#competencies' },
    { label: 'Case Studies', href: '#projects' },
    { label: 'Poster Exhibition', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-3.5 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-xs'
          : 'py-5 bg-transparent'
      }`}
    >
      {/* Top Scroll Indicator Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link
          href="/"
          className="group flex items-center gap-3 text-zinc-950 dark:text-white focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#ff4800] text-white flex items-center justify-center font-syne font-extrabold text-sm tracking-tight transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 shadow-sm shadow-orange-500/30">
            SC.
          </div>
          <div className="flex flex-col">
            <span className="font-syne font-bold text-sm tracking-tight group-hover:text-[#ff4800] transition-colors flex items-center gap-1.5">
              <span>Sok Chanmony</span>
              <span className="font-mono text-[10px] font-bold text-[#ff4800] bg-orange-500/10 dark:bg-orange-500/20 px-1.5 py-0.5 rounded border border-orange-500/25">
                GunerX
              </span>
            </span>
            <span className="text-[10px] font-mono tracking-wider text-zinc-600 dark:text-zinc-400 uppercase">
              Web Dev & Graphic Art
            </span>
          </div>
        </Link>

        {/* Center: Live ICT Clock & Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-50/50 dark:bg-orange-950/20 text-[11px] font-mono text-orange-700 dark:text-orange-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4800] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff4800]" />
            </span>
            <span>Phnom Penh</span>
            <span className="text-orange-300 dark:text-orange-700">•</span>
            <span>{currentTime || '15:20 ICT'}</span>
          </div>

          <nav className="flex items-center gap-1 border border-zinc-200/80 dark:border-zinc-800/80 rounded-full px-3 py-1 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-editorial-orange dark:hover:text-editorial-orange rounded-full transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Actions: Admin Link & Theme Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-50/40 hover:bg-orange-50 dark:bg-orange-950/20 dark:hover:bg-orange-950/40 text-xs font-mono font-medium text-orange-700 dark:text-orange-300 transition-all shadow-xs"
            title="Open Admin Poster Dashboard"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-editorial-orange" />
            <span>Admin Studio</span>
            <ArrowUpRight className="w-3 h-3 text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <ThemeToggle />

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl px-4 py-6 space-y-3"
          >
            <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Phnom Penh, Cambodia</span>
              <span className="text-editorial-orange">{currentTime}</span>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-syne font-semibold text-zinc-900 dark:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-mono font-semibold bg-[#ff4800] text-white mt-4 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Poster Management Studio</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
