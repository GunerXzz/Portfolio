'use client';

import * as React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { SkillsMatrix } from '@/components/SkillsMatrix';
import { ProjectsSection } from '@/components/ProjectsSection';
import { PosterGallery } from '@/components/PosterGallery';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col bg-background text-foreground selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Global Editorial Navigation */}
      <Navbar />

      {/* Hero Statement & Ticker */}
      <Hero />

      {/* Technical & Visual Competence Pillars */}
      <SkillsMatrix />

      {/* Featured Software Deployments */}
      <ProjectsSection />

      {/* Poster Exhibition & Print Gallery */}
      <PosterGallery />

      {/* Inquiries & Direct Communication */}
      <ContactSection />

      {/* Site Footer */}
      <Footer />
    </main>
  );
}
