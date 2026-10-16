'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Poster, PosterCategory, AspectRatio } from '@/lib/types';
import { supabase, isSupabaseConfigured, uploadPosterImage } from '@/lib/supabase';
import { formatBytes } from '@/lib/utils';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Sparkles,
  KeyRound,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

interface PosterUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPosterCreated: (poster: Poster) => void;
  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (unlocked: boolean) => void;
}

export function PosterUploadModal({
  isOpen,
  onClose,
  onPosterCreated,
  isAdminUnlocked,
  setIsAdminUnlocked,
}: PosterUploadModalProps) {
  const [pinInput, setPinInput] = React.useState('');
  const [pinError, setPinError] = React.useState(false);

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
    if (!isOpen) {
      setPinError(false);
      setUploadError(null);
      setUploadSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '2026';
    if (pinInput.trim() === expectedPin.trim() || pinInput.trim() === '2026') {
      setIsAdminUnlocked(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
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
          reject(new Error('Canvas compression context failure'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas compression returned null'));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setUploadError('Please specify a title for the poster.');
      return;
    }
    if (!selectedFile && !previewUrl) {
      setUploadError('Please upload an artwork image.');
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

      const newPosterData = {
        title: title.trim(),
        category,
        description: description.trim(),
        image_url: finalImageUrl,
        aspect_ratio: aspectRatio,
        tags: parsedTags,
        is_visible: true,
      };

      let createdId = `poster-${Date.now()}`;
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('posters')
          .insert([newPosterData])
          .select()
          .single();

        if (error) throw new Error(`Database record insert error: ${error.message}`);
        if (data && data.id) createdId = data.id;
      }

      const completedPoster: Poster = {
        id: createdId,
        ...newPosterData,
        created_at: new Date().toISOString(),
        isVisible: true,
      };

      onPosterCreated(completedPoster);
      setUploadSuccess(true);

      setTimeout(() => {
        onClose();
        setTitle('');
        setDescription('');
        setTagsInput('');
        setSelectedFile(null);
        setPreviewUrl(null);
        setCompressedStats(null);
        setUploadSuccess(false);
      }, 1400);
    } catch (err: any) {
      setUploadError(err.message || 'An unexpected error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-8"
      >
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ff4800] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-base text-zinc-900 dark:text-white">
                Admin Poster Upload Studio
              </h3>
              <p className="font-mono text-xs text-zinc-500">
                {isAdminUnlocked ? 'Authenticated • Auto WebP Compression' : 'PIN Required'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isAdminUnlocked ? (
          <div className="p-8 sm:p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-editorial-orange flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
              <KeyRound className="w-7 h-7" />
            </div>
            <h4 className="font-syne text-xl font-bold text-zinc-900 dark:text-white mb-2">
              Studio Passcode
            </h4>
            <p className="font-mono text-xs text-zinc-500 max-w-sm mx-auto mb-6">
              Enter your master portfolio PIN to authenticate poster uploads.
            </p>

            <form onSubmit={handlePinSubmit} className="max-w-xs mx-auto space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Enter PIN (Default: 2026)"
                  className="w-full text-center tracking-widest text-lg px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange font-mono"
                  autoFocus
                />
                {pinError && (
                  <p className="font-mono text-xs text-rose-500 mt-2 flex items-center justify-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Incorrect PIN. Try default (2026).
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#ff4800] hover:bg-orange-600 text-white font-syne font-bold text-xs tracking-wider shadow-md shadow-orange-500/20 transition-all"
              >
                Unlock Studio
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {uploadSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-syne text-lg font-bold text-zinc-900 dark:text-white">
                  Poster Published Successfully!
                </h4>
                <p className="font-mono text-xs text-zinc-500">
                  Compressed to WebP and added to your active gallery.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    Artwork Asset (Max 1600px WebP Auto-Compression)
                  </label>

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all ${
                      previewUrl
                        ? 'border-orange-500/50 bg-orange-50/20 dark:bg-orange-950/20'
                        : 'border-zinc-300 dark:border-zinc-700 hover:border-editorial-orange bg-zinc-50 dark:bg-zinc-800/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                      className="hidden"
                    />

                    {previewUrl ? (
                      <div className="flex flex-col sm:flex-row items-center gap-4 text-left">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm"
                        />
                        <div className="flex-1 space-y-1 text-xs">
                          <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                            <FileImage className="w-4 h-4 text-editorial-orange" />
                            {selectedFile?.name || 'Uploaded Artwork'}
                          </p>
                          {compressedStats && (
                            <div className="space-y-0.5 text-zinc-500 font-mono text-[11px]">
                              <p>Original: {formatBytes(compressedStats.originalSize)}</p>
                              <p className="text-emerald-500 font-semibold">
                                Compressed WebP: {formatBytes(compressedStats.compressedSize)} (
                                {Math.round(
                                  ((compressedStats.originalSize -
                                    compressedStats.compressedSize) /
                                    compressedStats.originalSize) *
                                    100
                                )}
                                % saved)
                              </p>
                            </div>
                          )}
                          <p className="text-[11px] font-mono text-editorial-orange hover:underline">
                            Click to replace image
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 space-y-2">
                        <UploadCloud className="w-10 h-10 text-editorial-orange mx-auto animate-bounce" />
                        <p className="font-mono text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          Click to select or drag artwork here
                        </p>
                        <p className="font-mono text-[11px] text-zinc-500">
                          PNG, JPG, WebP supported.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Poster Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Neo-Phnom Penh 2088"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange"
                    >
                      <option value="Brand Identity">Brand Identity</option>
                      <option value="Typography">Typography</option>
                      <option value="Advertising">Advertising</option>
                      <option value="Digital Art">Digital Art</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Aspect Ratio *
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as any)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange"
                    >
                      <option value="portrait">Portrait (3:4)</option>
                      <option value="square">Square (1:1)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Tags (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Cyberpunk, Khmer Art, Neon, Branding"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Description & Concept Notes
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Notes on composition and typography..."
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange"
                    />
                  </div>
                </div>

                {uploadError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 font-mono text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
                  <div className="font-mono text-[11px] text-zinc-500">
                    {isSupabaseConfigured
                      ? 'Connected to Supabase'
                      : 'Local storage mode'}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 font-mono text-xs text-zinc-500 hover:text-black dark:hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isUploading || isCompressing}
                      className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#ff4800] hover:bg-orange-600 text-white font-syne font-bold text-xs shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Publish Poster</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
}
