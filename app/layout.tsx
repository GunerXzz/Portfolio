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
  title: 'Sok Chanmony — Full-Stack Developer & Visual Artist',
  description:
    'Creative portfolio of Sok Chanmony: Dual-discipline technologist bridging high-performance systems engineering (Laravel, Next.js, Flutter) and brand-defining graphic arts based in Phnom Penh, Cambodia.',
  keywords: [
    'Sok Chanmony',
    'Full-Stack Developer Phnom Penh',
    'Laravel Next.js Flutter',
    'Poster Typography Designer',
    'Cambodia Creative Developer',
  ],
  authors: [{ name: 'Sok Chanmony' }],
  creator: 'Sok Chanmony',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sokchanmony.dev',
    title: 'Sok Chanmony — Full-Stack Developer & Visual Artist',
    description:
      'Dual-discipline technologist bridging high-performance systems engineering and brand-defining graphic arts.',
    siteName: 'Sok Chanmony Portfolio',
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
