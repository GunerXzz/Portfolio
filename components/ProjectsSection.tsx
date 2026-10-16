'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_PROJECTS } from '@/lib/initialData';
import { ProjectCategory } from '@/lib/types';
import { ArrowUpRight, Github, CheckCircle2, Layers, Database, Sparkles } from 'lucide-react';

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = React.useState<ProjectCategory>('All');

  const categories: ProjectCategory[] = ['All', 'Full-Stack', 'Mobile', 'Visual Identity'];

  const filteredProjects = React.useMemo(() => {
    if (selectedCategory === 'All') return INITIAL_PROJECTS;
    return INITIAL_PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section id="projects" className="py-28 relative overflow-hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header with Sweeping Animation */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 mb-16 border-b border-zinc-200 dark:border-zinc-800 gap-6"
        >
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-editorial-orange font-bold">
              Production Architecture & Portfolio
            </span>
            <h2 className="font-syne text-4xl sm:text-6xl font-extrabold text-zinc-950 dark:text-white tracking-tight mt-1">
              Selected Case Studies
            </h2>
            <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-xl">
              Deep-dive architectural breakdowns of database-driven platforms, client portals, and brand creative systems.
            </p>
          </div>

          {/* Filter Pills Bar */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-xs self-start">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#ff4800] text-white shadow-xs font-semibold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-[#ff4800] dark:hover:text-[#ff4800]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Alternating Directional Sweep Case Studies */}
        <div className="space-y-20 lg:space-y-28">
          <AnimatePresence>
            {filteredProjects.map((project, index) => {
              const isEven = index % 2 === 1; // Alternating layout
              const sweepDirection = isEven ? 80 : -80; // Sweeps from right for even, from left for odd

              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, x: sweepDirection }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-70px' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative rounded-3xl p-6 sm:p-10 bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-editorial-orange/50 dark:hover:border-editorial-orange/50 transition-all duration-300 shadow-xs hover:shadow-2xl hover:shadow-orange-500/5"
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}>
                    {/* Visual Media Column (7 Cols) */}
                    <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-md">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/95 text-zinc-950 backdrop-blur-md shadow-xs">
                            {project.category}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-950/80 text-zinc-300 backdrop-blur-md">
                            {project.year}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-white/90 hover:bg-[#ff4800] hover:text-white dark:bg-zinc-900/90 text-zinc-900 dark:text-white flex items-center justify-center backdrop-blur-md transition-colors shadow-sm"
                              title="View Code on GitHub"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-white/90 hover:bg-[#ff4800] hover:text-white dark:bg-zinc-900/90 text-zinc-900 dark:text-white flex items-center justify-center backdrop-blur-md transition-colors shadow-sm"
                              title="Live Case Study Preview"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Architectural Blueprint Column (5 Cols) */}
                    <div className={`lg:col-span-5 flex flex-col justify-between ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}>
                      <div>
                        {/* Number & Client Type Header */}
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200 dark:border-zinc-800">
                          <span className="font-mono text-xs font-semibold text-[#ff4800] tracking-wider uppercase">
                            {project.clientType}
                          </span>
                          <span className="font-syne text-3xl font-black text-zinc-400 dark:text-zinc-600">
                            {project.number}
                          </span>
                        </div>

                        {/* Title & Tagline */}
                        <h3 className="font-syne text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white leading-tight mb-1 group-hover:text-editorial-orange transition-colors">
                          {project.title}
                        </h3>
                        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                          {project.tagline}
                        </p>

                        {/* Problem Solved Callout */}
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-xs text-zinc-700 dark:text-zinc-300 mb-4 font-sans leading-relaxed">
                          <span className="font-mono text-[10px] uppercase font-bold text-editorial-orange block mb-1">
                            Key Solution Delivered:
                          </span>
                          {project.problemSolved}
                        </div>

                        {/* Architecture Highlights */}
                        <div className="space-y-2 mb-6">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block">
                            Engineering Highlights:
                          </span>
                          {project.architectureHighlights.map((highlight, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                              <CheckCircle2 className="w-3.5 h-3.5 text-editorial-orange shrink-0 mt-0.5" />
                              <span className="leading-snug">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
