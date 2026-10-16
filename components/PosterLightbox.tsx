'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Poster } from '@/lib/types';
import { X, Download, Tag, Sparkles } from 'lucide-react';

interface PosterLightboxProps {
  poster: Poster | null;
  onClose: () => void;
}

export function PosterLightbox({ poster, onClose }: PosterLightboxProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (poster) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [poster, onClose]);

  if (!poster) return null;

  const handleDownload = async () => {
    try {
      const res = await fetch(poster.image_url);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${poster.title.toLowerCase().replace(/\s+/g, '-')}.webp`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(poster.image_url, '_blank');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window with Scale & Sweep */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Artwork Showcase */}
          <div className="md:w-3/5 bg-zinc-950 flex items-center justify-center p-6 sm:p-10 min-h-[300px] md:min-h-[500px]">
            <img
              src={poster.image_url}
              alt={poster.title}
              className={`rounded-xl shadow-2xl object-contain max-h-[72vh] w-auto ${
                poster.aspect_ratio === 'square' ? 'aspect-square' : 'aspect-[3/4]'
              }`}
            />
          </div>

          {/* Metadata Sidebar */}
          <div className="md:w-2/5 p-8 flex flex-col justify-between overflow-y-auto bg-white dark:bg-zinc-900">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-500/20 mb-4">
                <Sparkles className="w-3 h-3 text-editorial-orange" />
                <span>{poster.category}</span>
              </div>

              <h3 className="font-syne text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight mb-3">
                {poster.title}
              </h3>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 font-sans">
                {poster.description || 'Custom crafted visual identity artwork by Sok Chanmony.'}
              </p>

              {/* Tags */}
              <div className="mb-6">
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 block mb-2">
                  Composition Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {poster.tags && poster.tags.length > 0 ? (
                    poster.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-2.5 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3 text-editorial-orange" />
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-400 italic">No tags specified</span>
                  )}
                </div>
              </div>

              {/* Specs */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 font-mono text-xs space-y-1.5 text-zinc-500">
                <div className="flex justify-between">
                  <span>Aspect Ratio:</span>
                  <span className="font-bold text-zinc-900 dark:text-white capitalize">
                    {poster.aspect_ratio} ({poster.aspect_ratio === 'portrait' ? '3:4' : '1:1'})
                  </span>
                </div>
                {poster.created_at && (
                  <div className="flex justify-between">
                    <span>Archived Date:</span>
                    <span className="text-zinc-800 dark:text-zinc-200">
                      {new Date(poster.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#ff4800] hover:bg-orange-600 text-white font-syne font-bold text-xs tracking-wide hover:scale-[1.01] transition-all shadow-sm shadow-orange-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Artwork</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
