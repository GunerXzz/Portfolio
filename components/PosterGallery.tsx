'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Poster, PosterCategory } from '@/lib/types';
import { getStoredPosters, syncPostersFromSupabase } from '@/lib/posterStore';
import { PosterLightbox } from './PosterLightbox';
import { Maximize2, ShieldCheck, ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function PosterGallery() {
  const [posters, setPosters] = React.useState<Poster[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<PosterCategory>('All');
  const [activePosterForLightbox, setActivePosterForLightbox] = React.useState<Poster | null>(null);

  const loadPosters = React.useCallback(() => {
    const list = getStoredPosters();
    const visibleOnly = list.filter((p) => p.isVisible !== false);
    setPosters(visibleOnly);
  }, []);

  React.useEffect(() => {
    loadPosters();
    syncPostersFromSupabase().then(() => loadPosters());

    const handleUpdate = () => loadPosters();
    window.addEventListener('posters-updated', handleUpdate);
    return () => window.removeEventListener('posters-updated', handleUpdate);
  }, [loadPosters]);

  const categories: PosterCategory[] = [
    'All',
    'Brand Identity',
    'Typography',
    'Advertising',
    'Digital Art',
  ];

  const filteredPosters = React.useMemo(() => {
    if (selectedCategory === 'All') return posters;
    return posters.filter((p) => p.category === selectedCategory);
  }, [posters, selectedCategory]);

  return (
    <section id="gallery" className="py-28 relative overflow-hidden bg-zinc-50/70 dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Exhibition Header with Left-Sweep */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 mb-12 border-b border-zinc-200 dark:border-zinc-800 gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-editorial-orange animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-editorial-orange font-bold">
                Graphic Art & Poster Showcase
              </span>
            </div>
            <h2 className="font-syne text-4xl sm:text-6xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              Poster Exhibition
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl font-sans">
              Curated print and digital artworks exploring modern Khmer script ligatures, brand packaging architectures, and typographic rhythm.
            </p>
          </div>

          {/* Manage Button linking to Admin Dashboard */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-orange-500/30 bg-white dark:bg-zinc-900 hover:border-editorial-orange text-xs font-mono font-semibold text-zinc-900 dark:text-white transition-all shadow-xs self-start"
          >
            <ShieldCheck className="w-4 h-4 text-editorial-orange" />
            <span>Manage Gallery / Upload</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-orange-500" />
          </Link>
        </motion.div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-12 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-[#ff4800] text-white font-bold shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-[#ff4800] dark:hover:text-[#ff4800] border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Multi-Column Gallery Grid with Alternating Sweep Animations */}
        {filteredPosters.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
            <p className="font-syne text-lg font-bold text-zinc-900 dark:text-white mb-2">
              No posters found under &quot;{selectedCategory}&quot;
            </p>
            <p className="text-xs font-mono text-zinc-500 mb-4">
              Switch categories or access the Admin Studio to enable artwork visibility.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-mono text-editorial-orange font-bold hover:underline"
            >
              Reset to All ({posters.length} total)
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence>
              {filteredPosters.map((poster, index) => {
                // Alternating sweep direction based on index
                const sweepX = index % 2 === 0 ? -50 : 50;

                return (
                  <motion.div
                    key={poster.id}
                    layout
                    initial={{ opacity: 0, x: sweepX }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setActivePosterForLightbox(poster)}
                    className="group relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1.5 transition-all duration-300"
                  >
                    <div
                      className={`w-full relative overflow-hidden bg-zinc-900 ${
                        poster.aspect_ratio === 'square' ? 'aspect-square' : 'aspect-[3/4]'
                      }`}
                    >
                      <img
                        src={poster.image_url}
                        alt={poster.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />

                      {/* Smooth Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-[#ff4800] text-white shadow-xs">
                            {poster.category}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-white/20 hover:bg-[#ff4800] text-white flex items-center justify-center backdrop-blur-md transition-colors">
                            <Maximize2 className="w-4 h-4" />
                          </div>
                        </div>

                        <div>
                          <h4 className="font-syne text-lg font-bold text-white tracking-tight leading-snug mb-1">
                            {poster.title}
                          </h4>
                          <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-3">
                            {poster.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {poster.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-200"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <PosterLightbox
        poster={activePosterForLightbox}
        onClose={() => setActivePosterForLightbox(null)}
      />
    </section>
  );
}
