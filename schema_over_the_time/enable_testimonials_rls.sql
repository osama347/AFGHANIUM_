-- Enable RLS and create policies for testimonials and site_content tables
-- Run this in your Supabase SQL Editor

-- Enable RLS on site_content table
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;

-- Public can view all site content (for About Us page, etc.)
CREATE POLICY "Public can view site content"
ON public.site_content FOR SELECT
TO anon, authenticated
USING (true);

-- Only authenticated users (admins) can manage site content
CREATE POLICY "Admins can manage site content"
ON public.site_content FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Enable RLS on testimonials table
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view active testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can view all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;

-- Public can view only active testimonials
CREATE POLICY "Public can view active testimonials"
ON public.testimonials FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Authenticated users (admins) can view all testimonials
CREATE POLICY "Admins can view all testimonials"
ON public.testimonials FOR SELECT
TO authenticated
USING (true);

-- Authenticated users (admins) can manage all testimonials
CREATE POLICY "Admins can manage testimonials"
ON public.testimonials FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);