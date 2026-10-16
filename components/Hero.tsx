'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { DEVELOPER_PROFILE } from '@/lib/initialData';
import { ArrowDownRight, ArrowRight, CornerDownRight, Smartphone, Sparkles, GraduationCap } from 'lucide-react';

export function Hero() {
  const [roleIndex, setRoleIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % DEVELOPER_PROFILE.roles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const marqueeKeywords = [
    '⚡ GUNERXZZ (SOK CHANMONY)',
    'FULL-STACK WEB DEV',
    'VUE 3 & NUXT 3',
    'NEXT.JS 14 & REACT',
    'PHP & LARAVEL 11',
    'POSTER & TYPOGRAPHY DESIGN',
    '4TH YEAR CS SENIOR',
    'MYSQL & POSTGRESQL',
    'RESTFUL APIS',
    'GUNERXZZ // PHNOM PENH, KH',
  ];

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden editorial-grid">
      {/* Lively non-stop ambient floating energy glow orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/15 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-red-600/12 dark:bg-red-600/8 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Header Row with Sweeping Animation */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10 border-b border-zinc-200 dark:border-zinc-800 gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4800] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff4800]" />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff4800] font-bold flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              4th Year CS Senior & Developer • GunerX
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <span>Available for Junior Roles & Freelance</span>
            <span>•</span>
            <span>Phnom Penh, KH</span>
          </div>
        </motion.div>

        {/* Main Headline with Sweep-In */}
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-syne text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[0.95] mb-6">
              Building Web Apps.
              <br />
              <span className="italic font-light text-zinc-500 dark:text-zinc-400">
                Designing
              </span>{' '}
              <span className="relative inline-block text-[#ff4800] underline decoration-[#ff4800]/80 decoration-wavy decoration-2 underline-offset-8">
                Visual Art.
              </span>
            </h1>
          </motion.div>

          {/* Dynamic Role Badge & Bio Grid with Directional Sweep */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
            {/* Left Sweep */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 space-y-4"
            >
              <div className="p-4 rounded-2xl border border-orange-500/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-xs">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center justify-between">
                  <span>Current Practice</span>
                  <span className="text-[#ff4800] font-bold">0{roleIndex + 1}/03</span>
                </div>
                <div className="h-9 flex items-center overflow-hidden">
                  <motion.p
                    key={DEVELOPER_PROFILE.roles[roleIndex]}
                    initial={{ y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -18, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="font-syne font-bold text-lg sm:text-xl text-zinc-900 dark:text-white tracking-tight"
                  >
                    {DEVELOPER_PROFILE.roles[roleIndex]}
                  </motion.p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-syne font-bold text-xs tracking-wide transition-all hover:bg-[#ff4800] hover:text-white dark:hover:bg-[#ff4800] dark:hover:text-white shadow-sm"
                >
                  <span>View Case Studies</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#gallery"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-syne font-bold text-xs tracking-wide hover:border-[#ff4800] transition-colors"
                >
                  <span>Poster Exhibition</span>
                  <ArrowDownRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform text-[#ff4800]" />
                </a>
              </div>
            </motion.div>

            {/* Right Sweep */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 lg:pl-6 space-y-4"
            >
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                {DEVELOPER_PROFILE.bio}
              </p>

              {/* Note on Flutter */}
              <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-50/40 dark:bg-orange-950/20 font-mono text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
                <Smartphone className="w-4 h-4 text-[#ff4800] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {DEVELOPER_PROFILE.flutterNote}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Endless Loop Kinetic Marquee Ribbon with Editorial Orange */}
      <div className="mt-16 border-y border-zinc-200 dark:border-zinc-800 py-3.5 bg-zinc-50/80 dark:bg-zinc-900/60 overflow-hidden flex whitespace-nowrap marquee-container select-none">
        {/* Track 1 */}
        <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8 text-xs font-mono font-bold tracking-widest text-zinc-800 dark:text-zinc-200 uppercase">
          {marqueeKeywords.map((keyword, index) => (
            <React.Fragment key={`t1-${keyword}-${index}`}>
              <span className={keyword.includes('GUNERX') ? 'text-[#ff4800] dark:text-orange-400 font-extrabold flex items-center gap-1.5' : ''}>
                {keyword.includes('GUNERX') && <span className="w-2 h-2 rounded-full bg-[#ff4800] animate-ping shrink-0" />}
                {keyword}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4800] shrink-0" />
            </React.Fragment>
          ))}
        </div>
        {/* Track 2 (Cloned for mathematically seamless 100% endless continuous loop) */}
        <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8 text-xs font-mono font-bold tracking-widest text-zinc-800 dark:text-zinc-200 uppercase" aria-hidden="true">
          {marqueeKeywords.map((keyword, index) => (
            <React.Fragment key={`t2-${keyword}-${index}`}>
              <span className={keyword.includes('GUNERX') ? 'text-[#ff4800] dark:text-orange-400 font-extrabold flex items-center gap-1.5' : ''}>
                {keyword.includes('GUNERX') && <span className="w-2 h-2 rounded-full bg-[#ff4800] animate-ping shrink-0" />}
                {keyword}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4800] shrink-0" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
