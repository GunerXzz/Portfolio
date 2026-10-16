# Sok Chanmony (GunerXzz) — Full-Stack Developer & Visual Designer

A bespoke, editorial portfolio and poster exhibition engine built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Supabase BaaS**.

- **GitHub Profile**: [https://github.com/GunerXzz](https://github.com/GunerXzz)
- **Live Portfolio Showcase**: [https://gunerxzz.github.io/My-Portfolio/](https://gunerxzz.github.io/My-Portfolio/)
- **Featured Repositories**:
  - [Pos-and-Managment-System](https://github.com/GunerXzz/Pos-and-Managment-System) (Nuxt 3, Vue 3, i18n, Color Mode)
  - [POS](https://github.com/GunerXzz/POS) (Point of Sale Engine, PHP / Laravel)
  - [My-Portfolio](https://github.com/GunerXzz/My-Portfolio) (Glassmorphism Portfolio Showcase)
  - [motivation](https://github.com/GunerXzz/motivation) (Editorial Typography Portal)

---

## Visual Design & Architecture Highlights

- **Editorial Gallery Canvas**: Clean, high-fashion gallery white foundation with stark ink black accents and avant-garde **Editorial Orange** (`#ff4800`).
- **Dynamic Sweeping Scroll Animations**:
  - Elements and sections physically sweep across the viewport from left (`x: -80`) and right (`x: 80`) with spring physics as you scroll down.
  - Alternating magazine split layouts for case studies (image-left/spec-right, image-right/spec-left).
  - Real-time physics scroll progress indicator bar at the top of the viewport.
- **Distinctive Typography**:
  - **Syne**: Bold, avant-garde display typography for statement headlines and exhibition titles.
  - **Plus Jakarta Sans**: Clean editorial body text.
  - **JetBrains Mono**: Technical labels, metadata, and timestamps.
- **Developer Profile & Disciplines**:
  - **Sok Chanmony (GunerXzz)**: 4th-Year Computer Science Senior based in Phnom Penh, Cambodia.
  - **Three Core Disciplines**:
    1. **Full-Stack Web Development**: Nuxt 3, Vue 3, Next.js 14, React, PHP 8.3, Laravel 11, MySQL, PostgreSQL, RESTful APIs.
    2. **Graphic & Poster Design**: Exhibition posters, Khmer ligatures, brand guidelines, packaging art, e-commerce assets.
    3. **Academic Studies & Mobile Explorations**: Senior-year CS algorithms, university coursework in Flutter & Dart, and Java OOP.
- **Dedicated Admin Studio (`/admin`)**:
  - Protected with Master PIN (`2026`).
  - Persistent session storage.
  - Live **Show / Hide** visibility toggles to control which posters appear on the public gallery.
  - Direct deletion & metadata review.
  - Client-side canvas WebP compression (max 1600px) before upload.
  - Direct Supabase cloud database & storage bucket integration with local fallback.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit:
- Public Portfolio: [http://localhost:3000](http://localhost:3000)
- Admin Studio: [http://localhost:3000/admin](http://localhost:3000/admin) (Default PIN: `2026`)

### 3. Supabase Integration (Optional)
Run [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL Editor and add keys to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_ADMIN_PIN=2026
```
