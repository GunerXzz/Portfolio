'use client';

import * as React from 'react';
import Link from 'next/link';
import { DEVELOPER_PROFILE } from '@/lib/initialData';
import { ArrowUp, Github, Linkedin, ShieldCheck } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-900">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ff4800] text-white flex items-center justify-center font-syne font-extrabold text-xs">
              SC.
            </div>
            <div>
              <p className="font-syne font-bold text-zinc-950 dark:text-white">
                Sok Chanmony
              </p>
              <p className="font-mono text-[11px] text-zinc-400">
                Full-Stack Systems & Visual Art Direction
              </p>
            </div>
          </div>

          {/* Socials & Top */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Studio Admin</span>
            </Link>

            <a
              href={DEVELOPER_PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
              title="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>

            <a
              href={DEVELOPER_PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
              title="Scroll to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-400">
          <p>© 2026 Sok Chanmony (GunerXzz). All rights reserved.</p>
          <p>Engineered with Next.js 14, TypeScript, Tailwind, &amp; Supabase</p>
        </div>
      </div>
    </footer>
  );
}
