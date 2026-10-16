import type { Metadata } from 'next';
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sok Chanmony (GunerXzz) — Full-Stack Developer & Visual Artist',
  description:
    'Creative portfolio of Sok Chanmony (GunerXzz): Dual-discipline technologist bridging high-performance systems engineering (Nuxt 3, Vue 3, Next.js 14, Laravel 11) and brand-defining graphic arts based in Phnom Penh, Cambodia.',
  keywords: [
    'Sok Chanmony',
    'GunerXzz',
    'Full-Stack Developer Phnom Penh',
    'Nuxt 3 Vue 3 Developer',
    'Next.js 14 Laravel Developer',
    'Khmer Poster Typography Designer',
    'Cambodia Creative Technologist',
  ],
  authors: [{ name: 'Sok Chanmony (GunerXzz)', url: 'https://github.com/GunerXzz' }],
  creator: 'Sok Chanmony (GunerXzz)',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gunerxzz.github.io/My-Portfolio/',
    title: 'Sok Chanmony (GunerXzz) — Full-Stack Developer & Visual Artist',
    description:
      'Dual-discipline technologist bridging high-performance systems engineering (Nuxt 3, Vue, Next.js, Laravel) and brand-defining graphic arts.',
    siteName: 'Sok Chanmony (GunerXzz) Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sok Chanmony (GunerXzz) — Full-Stack Developer & Visual Artist',
    description:
      'Full-Stack Web Architect & Visual Art Director crafting reactive systems & avant-garde typography.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${jakarta.variable} ${mono.variable}`}
    >
      <body className="min-h-screen antialiased bg-background text-foreground font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
