'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { DEVELOPER_PROFILE } from '@/lib/initialData';
import { Mail, Send, MapPin, MessageSquare, Check, Copy, ExternalLink, ArrowRight } from 'lucide-react';

export function ContactSection() {
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DEVELOPER_PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 900);
  };

  return (
    <section id="contact" className="py-28 relative overflow-hidden bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Left-Sweep */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pb-8 mb-16 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-editorial-orange font-bold">
              Direct Communication
            </span>
            <h2 className="font-syne text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight mt-1">
              Let&apos;s Connect
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 max-w-md">
            Open for full-stack web contracts, freelance design projects, and junior software engineer roles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Cards with Sweep Left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Email Card */}
            <div className="p-7 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start gap-4 hover:border-editorial-orange/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-[#ff4800] text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-0.5">
                  Email
                </span>
                <p className="font-syne font-bold text-base text-zinc-950 dark:text-white truncate">
                  {DEVELOPER_PROFILE.email}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#ff4800] hover:underline"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <a
                    href={`mailto:${DEVELOPER_PROFILE.email}`}
                    className="font-mono text-xs text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white flex items-center gap-1"
                  >
                    Compose <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Telegram Card */}
            <div className="p-7 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start gap-4 hover:border-editorial-orange/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0 shadow-sm">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-0.5">
                  Telegram
                </span>
                <p className="font-syne font-bold text-base text-zinc-950 dark:text-white">
                  {DEVELOPER_PROFILE.telegram}
                </p>
                <div className="mt-3">
                  <a
                    href={DEVELOPER_PROFILE.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#ff4800] hover:underline"
                  >
                    Open Telegram <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="p-7 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-0.5">
                  Location
                </span>
                <p className="font-syne font-bold text-base text-zinc-950 dark:text-white">
                  {DEVELOPER_PROFILE.location}
                </p>
                <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Timezone: {DEVELOPER_PROFILE.timezone}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Form with Sweep Right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="p-8 sm:p-10 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <h3 className="font-syne text-xl font-bold text-zinc-950 dark:text-white mb-2">
                Send a Direct Message
              </h3>
              <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 mb-6">
                Feel free to reach out regarding a project, full-stack role, or design inquiry.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Alex"
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="alex@example.com"
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    placeholder="e.g. Web Development / Poster Graphic Project"
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell me about your project or inquiry..."
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-editorial-orange transition-colors"
                  />
                </div>

                {isSubmitted && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Your message has been sent successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#ff4800] hover:bg-orange-600 text-white font-syne font-bold text-xs tracking-wide hover:scale-[1.01] transition-transform shadow-md shadow-orange-500/25 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
