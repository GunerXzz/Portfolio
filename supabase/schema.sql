-- ============================================================================
-- SOK CHANMONY PORTFOLIO: SUPABASE SCHEMA MIGRATION
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ============================================================================

-- 1. Create posters Table
CREATE TABLE IF NOT EXISTS public.posters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'Brand Identity', 'Typography', 'Advertising', 'Digital Art'
  description TEXT,
  image_url TEXT NOT NULL,
  aspect_ratio VARCHAR(20) DEFAULT 'portrait', -- 'portrait' (3:4) or 'square' (1:1)
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.posters ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for Table
-- Allow anyone to read posters
DROP POLICY IF EXISTS "Public Read Access" ON public.posters;
CREATE POLICY "Public Read Access" 
ON public.posters 
FOR SELECT 
USING (true);

-- Allow inserting posters (supports both anon client with PIN protection and authenticated users)
DROP POLICY IF EXISTS "Allow Insert Posters" ON public.posters;
CREATE POLICY "Allow Insert Posters" 
ON public.posters 
FOR INSERT 
WITH CHECK (true);

-- Allow deleting posters
DROP POLICY IF EXISTS "Allow Delete Posters" ON public.posters;
CREATE POLICY "Allow Delete Posters" 
ON public.posters 
FOR DELETE 
USING (true);

-- 4. Setup Storage Bucket for Poster Gallery
INSERT INTO storage.buckets (id, name, public)
VALUES ('poster-gallery', 'poster-gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Storage Read Access" ON storage.objects;
CREATE POLICY "Public Storage Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'poster-gallery');

DROP POLICY IF EXISTS "Public Storage Upload Access" ON storage.objects;
CREATE POLICY "Public Storage Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'poster-gallery');

DROP POLICY IF EXISTS "Public Storage Delete Access" ON storage.objects;
CREATE POLICY "Public Storage Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'poster-gallery');

-- 5. Seed Initial Sample Posters (Optional)
INSERT INTO public.posters (title, category, description, image_url, aspect_ratio, tags)
VALUES
  (
    'Khmer Cyberpunk: Neo-Phnom Penh 2088',
    'Digital Art',
    'Futuristic exploration of Phnom Penh urban heritage juxtaposed with holographic typography and neon brutalism.',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    'portrait',
    ARRAY['Cyberpunk', 'Concept Art', 'Neon', 'Cambodia']
  ),
  (
    'Cushion Skin: Minimalist Organic Cosmetics',
    'Brand Identity',
    'Complete visual branding, package label composition, and high-impact e-commerce editorial art for Korean skincare.',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    'square',
    ARRAY['Branding', 'Packaging', 'Beauty', 'Minimalism']
  ),
  (
    'Kinetic Typography: Khmer Script Rhythms',
    'Typography',
    'Experimental typographic poster dissecting modern Khmer ligatures and dynamic grid structures.',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    'portrait',
    ARRAY['Typography', 'Khmer', 'Editorial', 'Print']
  ),
  (
    'THHAKNAY & Associates: Law & Order Identity',
    'Advertising',
    'Luxury promotional campaign and corporate identity mockup with deep navy and foil-gold aesthetics.',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    'square',
    ARRAY['Corporate', 'Advertising', 'Identity', 'Legal']
  )
ON CONFLICT DO NOTHING;
