'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Poster, PosterCategory, AspectRatio } from '@/lib/types';
import { getStoredPosters, saveStoredPosters, syncPostersFromSupabase } from '@/lib/posterStore';
import { supabase, isSupabaseConfigured, uploadPosterImage } from '@/lib/supabase';
import { formatBytes } from '@/lib/utils';
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  ArrowLeft,
  UploadCloud,
  FileImage,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Database,
  LogOut,
  X,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [pinInput, setPinInput] = React.useState('');
  const [pinError, setPinError] = React.useState(false);

  // Posters state
  const [posters, setPosters] = React.useState<Poster[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<PosterCategory>('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState<Exclude<PosterCategory, 'All'>>('Brand Identity');
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>('portrait');
  const [tagsInput, setTagsInput] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [compressedStats, setCompressedStats] = React.useState<{
    originalSize: number;
    compressedSize: number;
  } | null>(null);
  const [isCompressing, setIsCompressing] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const session = sessionStorage.getItem('sok_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const refreshPosters = React.useCallback(() => {
    const list = getStoredPosters();
    setPosters(list);
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      refreshPosters();
      syncPostersFromSupabase().then(() => refreshPosters());
    }
  }, [isAuthenticated, refreshPosters]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '2026';
    if (pinInput.trim() === expectedPin.trim() || pinInput.trim() === '2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('sok_admin_auth', 'true');
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sok_admin_auth');
  };

  const handleToggleVisibility = async (posterId: string) => {
    const updated = posters.map((p) => {
      if (p.id === posterId) {
        const nextVisible = p.isVisible === false ? true : false;
        return { ...p, isVisible: nextVisible };
      }
      return p;
    });

    setPosters(updated);
    saveStoredPosters(updated);

    if (isSupabaseConfigured && supabase) {
      const target = updated.find((p) => p.id === posterId);
      if (target) {
        await supabase
          .from('posters')
          .update({ is_visible: target.isVisible })
          .eq('id', posterId);
      }
    }
  };

  const handleDeletePoster = async (posterId: string) => {
    if (!confirm('Are you sure you want to delete this poster from your collection?')) return;

    const updated = posters.filter((p) => p.id !== posterId);
    setPosters(updated);
    saveStoredPosters(updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('posters').delete().eq('id', posterId);
    }
  };

  const compressImage = async (file: File): Promise<{ blob: Blob; url: string }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const maxDimension = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context failure'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas compression failed'));
              return;
            }
            const url = URL.createObjectURL(blob);
            resolve({ blob, url });
          },
          'image/webp',
          0.85
        );
      };

      img.onerror = () => reject(new Error('Failed to load image for compression'));
    });
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    setUploadError(null);
    setSelectedFile(file);
    setIsCompressing(true);

    try {
      const { blob, url } = await compressImage(file);
      setPreviewUrl(url);
      setCompressedStats({
        originalSize: file.size,
        compressedSize: blob.size,
      });
    } catch {
      setPreviewUrl(URL.createObjectURL(file));
      setCompressedStats(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setUploadError('Please enter a poster title.');
      return;
    }
    if (!selectedFile && !previewUrl) {
      setUploadError('Please choose or drop an artwork file.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      let finalImageUrl = previewUrl || '';

      if (selectedFile) {
        const { blob } = await compressImage(selectedFile);
        finalImageUrl = await uploadPosterImage(blob, selectedFile.name);
      }

      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const newPoster: Poster = {
        id: `poster-${Date.now()}`,
        title: title.trim(),
        category,
        description: description.trim(),
        image_url: finalImageUrl,
        aspect_ratio: aspectRatio,
        tags: parsedTags,
        created_at: new Date().toISOString(),
        isVisible: true,
      };

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('posters')
          .insert([
            {
              title: newPoster.title,
              category: newPoster.category,
              description: newPoster.description,
              image_url: newPoster.image_url,
              aspect_ratio: newPoster.aspect_ratio,
              tags: newPoster.tags,
              is_visible: true,
            },
          ])
          .select()
          .single();

        if (data && data.id) newPoster.id = data.id;
      }

      const updated = [newPoster, ...posters];
      setPosters(updated);
      saveStoredPosters(updated);

      setUploadSuccess(true);
      setTimeout(() => {
        setIsUploadOpen(false);
        setTitle('');
        setDescription('');
        setTagsInput('');
        setSelectedFile(null);
        setPreviewUrl(null);
        setCompressedStats(null);
        setUploadSuccess(false);
      }, 1200);
    } catch (err: any) {
      setUploadError(err.message || 'Error occurred while publishing poster.');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredPosters = posters.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeCount = posters.filter((p) => p.isVisible !== false).length;
  const hiddenCount = posters.filter((p) => p.isVisible === false).length;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-black font-sans">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#ff4800] text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-500/25">
            <KeyRound className="w-6 h-6" />
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#ff4800] font-bold">
            Studio Security Gate
          </span>
          <h1 className="font-syne text-2xl font-extrabold text-zinc-950 dark:text-white mt-1 mb-2">
            Poster Studio Admin
          </h1>
          <p className="font-mono text-xs text-zinc-500 mb-6">
            Enter master PIN to manage your poster exhibition.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter PIN (Default: 2026)"
                className="w-full text-center tracking-widest text-xl px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange font-mono"
                autoFocus
              />
              {pinError && (
                <p className="font-mono text-xs text-rose-500 mt-2">
                  Incorrect PIN. (Default: 2026)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#ff4800] hover:bg-orange-600 text-white font-syne font-bold text-xs tracking-wider shadow-md shadow-orange-500/25 transition-all hover:scale-[1.01]"
            >
              Open Studio Dashboard
            </button>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-editorial-orange"
              >
                <ArrowLeft className="w-3 h-3" /> Return to Live Portfolio
              </Link>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-600 hover:text-editorial-orange px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portfolio</span>
            </Link>

            <div className="h-4 w-px bg-zinc-200 dark:border-zinc-800" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#ff4800] text-white flex items-center justify-center font-syne font-bold text-xs">
                SC
              </div>
              <span className="font-syne font-bold text-sm tracking-tight hidden sm:inline">
                Poster Exhibition Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff4800] text-white font-syne font-bold text-xs tracking-wide hover:scale-[1.02] transition-transform shadow-sm shadow-orange-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Poster</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-rose-500 transition-colors"
              title="Lock / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Total Posters in Archive
            </span>
            <p className="font-syne text-3xl font-extrabold text-zinc-950 dark:text-white">
              {posters.length}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Active on Live Portfolio
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <p className="font-syne text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {activeCount}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Hidden / Stored
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
              <p className="font-syne text-3xl font-extrabold text-zinc-500">
                {hiddenCount}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Storage Backend
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Database className="w-4 h-4 text-editorial-orange" />
              <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                {isSupabaseConfigured ? 'Supabase CDN' : 'Local Storage Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-8 shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', 'Brand Identity', 'Typography', 'Advertising', 'Digital Art'] as PosterCategory[]).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#ff4800] text-white font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title or tag..."
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange"
            />
          </div>
        </div>

        {/* Poster Management Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosters.map((poster) => {
            const isVisible = poster.isVisible !== false;

            return (
              <div
                key={poster.id}
                className={`rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                  isVisible
                    ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xs'
                    : 'bg-zinc-100/70 dark:bg-zinc-900/40 border-dashed border-zinc-300 dark:border-zinc-800 opacity-75'
                }`}
              >
                <div>
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-950 mb-4">
                    <img
                      src={poster.image_url}
                      alt={poster.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/80 text-white backdrop-blur-md">
                        {poster.category}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-white/80 text-black backdrop-blur-md uppercase">
                        {poster.aspect_ratio}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {isVisible ? (
                        <span className="flex items-center gap-1 font-mono text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-xs">
                          <Eye className="w-3 h-3" /> Visible
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-mono text-[10px] font-semibold px-2.5 py-1 rounded-full bg-zinc-700 text-zinc-300">
                          <EyeOff className="w-3 h-3" /> Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-syne font-bold text-lg text-zinc-950 dark:text-white leading-snug mb-1">
                    {poster.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
                    {poster.description || 'No description notes.'}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {poster.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(poster.id)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-mono text-xs font-semibold transition-colors ${
                      isVisible
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                        : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                    }`}
                  >
                    {isVisible ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide on Public Site</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show on Public Site</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePoster(poster.id)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete Poster"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Upload Modal Drawer */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative z-10 w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-editorial-orange text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-syne font-bold text-lg text-zinc-950 dark:text-white">
                    Upload Artwork to Studio
                  </h3>
                  <p className="font-mono text-xs text-zinc-400">
                    Auto-compressed to WebP (max 1600px)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="p-2 text-zinc-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-syne text-xl font-bold text-zinc-950 dark:text-white">
                  Poster Added & Live!
                </h4>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 text-center cursor-pointer hover:border-editorial-orange transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                    className="hidden"
                  />
                  {previewUrl ? (
                    <div className="flex items-center gap-4 text-left">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700"
                      />
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-zinc-900 dark:text-white">
                          {selectedFile?.name || 'Uploaded File'}
                        </p>
                        {compressedStats && (
                          <p className="font-mono text-emerald-500 font-bold">
                            Compressed to {formatBytes(compressedStats.compressedSize)} (
                            {Math.round(
                              ((compressedStats.originalSize - compressedStats.compressedSize) /
                                compressedStats.originalSize) *
                                100
                            )}
                            % reduction)
                          </p>
                        )}
                        <p className="text-editorial-orange">Click to pick a different image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <UploadCloud className="w-8 h-8 text-editorial-orange mx-auto animate-bounce" />
                      <p className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Click or drag artwork here
                      </p>
                      <p className="font-mono text-[11px] text-zinc-400">PNG, JPG, WebP</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Poster Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Kinetic Typography: Khmer Script"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange"
                    >
                      <option value="Brand Identity">Brand Identity</option>
                      <option value="Typography">Typography</option>
                      <option value="Advertising">Advertising</option>
                      <option value="Digital Art">Digital Art</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Aspect Ratio *
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as any)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange"
                    >
                      <option value="portrait">Portrait (3:4)</option>
                      <option value="square">Square (1:1)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Cyberpunk, Khmer Art, Neon"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Description & Concept
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Concept details..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange"
                  />
                </div>

                {uploadError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 font-mono text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="px-4 py-2 font-mono text-xs text-zinc-500 hover:text-black dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || isCompressing}
                    className="px-6 py-2.5 rounded-full bg-[#ff4800] hover:bg-orange-600 text-white font-syne font-bold text-xs tracking-wider shadow-sm shadow-orange-500/20 disabled:opacity-50"
                  >
                    {isUploading ? 'Publishing...' : 'Save & Publish'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
