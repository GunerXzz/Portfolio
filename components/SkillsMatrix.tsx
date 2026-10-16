'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { INITIAL_SKILL_PILLARS } from '@/lib/initialData';
import { CheckCircle2, Code2, Palette, GraduationCap } from 'lucide-react';

// Bespoke Modern Visual Emblems for each Discipline Pillar (Zero text, clean aesthetic glyphs)
function EngineeringEmblem() {
  return (
    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/30 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 group-hover:border-orange-500 transition-all duration-300">
      <div className="absolute inset-0 bg-radial from-orange-500/20 via-transparent to-transparent opacity-60" />
      <Code2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#ff4800] relative z-10 transition-transform duration-300 group-hover:scale-110" />
    </div>
  );
}

function DesignEmblem() {
  return (
    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/30 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 group-hover:border-orange-500 transition-all duration-300">
      <div className="absolute inset-0 bg-radial from-rose-500/20 via-transparent to-transparent opacity-60" />
      <Palette className="w-6 h-6 sm:w-7 sm:h-7 text-[#ff4800] relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
    </div>
  );
}

function AcademicEmblem() {
  return (
    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/30 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 group-hover:border-orange-500 transition-all duration-300">
      <div className="absolute inset-0 bg-radial from-amber-500/20 via-transparent to-transparent opacity-60" />
      <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-[#ff4800] relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
    </div>
  );
}

const emblems = [
  <EngineeringEmblem key="eng" />,
  <DesignEmblem key="design" />,
  <AcademicEmblem key="academic" />,
];

// Distinct directional sweep directions for each pillar
const sweepVariants = [
  { initial: { opacity: 0, x: -70 }, inView: { opacity: 1, x: 0 } },
  { initial: { opacity: 0, y: 60 }, inView: { opacity: 1, y: 0 } },
  { initial: { opacity: 0, x: 70 }, inView: { opacity: 1, x: 0 } },
];

export function SkillsMatrix() {
  return (
    <section id="competencies" className="py-24 relative overflow-hidden bg-zinc-50/50 dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Left-Sweep */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-4"
        >
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff4800] font-bold">
              Capabilities & Focus
            </span>
            <h2 className="font-syne text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight mt-1">
              Skills & Experience
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 max-w-md">
            Backend database architectures, reactive frontend interfaces, visual typography, and senior computer science studies.
          </p>
        </motion.div>

        {/* 3 Pillars Grid with Sweep Animations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {INITIAL_SKILL_PILLARS.map((pillar, idx) => {
            const variant = sweepVariants[idx] || sweepVariants[1];

            return (
              <motion.div
                key={pillar.title}
                initial={variant.initial}
                whileInView={variant.inView}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-3xl p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/60 dark:hover:border-orange-500/60 transition-all duration-300 shadow-xs hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Pillar Header with Bespoke Emblem */}
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3.5">
                      {emblems[idx]}
                      <div>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#ff4800] font-bold">
                          {pillar.discipline}
                        </span>
                        <h3 className="font-syne font-bold text-lg text-zinc-950 dark:text-white leading-tight">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>
                    <span className="font-syne text-2xl font-black text-zinc-400 dark:text-zinc-600 group-hover:text-[#ff4800] transition-colors">
                      {pillar.number}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-8 font-sans">
                    {pillar.description}
                  </p>

                  {/* Competencies Progress Bars with Guaranteed High-Contrast Colors and Zero Overlapping */}
                  <div className="space-y-4 mb-8">
                    {pillar.competencies.map((comp) => (
                      <div key={comp.name} className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2.5 text-xs">
                          <div className="flex items-start gap-1.5 min-w-0 flex-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff4800] shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block leading-snug">
                                {comp.name}
                              </span>
                              <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                                {comp.level}
                              </span>
                            </div>
                          </div>
                          <span className="shrink-0 font-mono text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/25">
                            {comp.proficiency}%
                          </span>
                        </div>

                        {/* Progress Bar with High-Contrast Track and Reliable Scaling */}
                        <div className="relative w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/90 dark:border-zinc-700/80 overflow-hidden shadow-inner">
                          <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true, margin: '-20px' }}
                            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                              width: `${comp.proficiency}%`,
                              transformOrigin: 'left',
                            }}
                            className="h-full bg-gradient-to-r from-orange-500 via-[#ff4800] to-amber-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tag Chips */}
                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-1.5">
                  {pillar.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 group-hover:border-orange-500/40 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

