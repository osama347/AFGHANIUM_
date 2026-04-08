-- Create testimonials and site_content tables if they don't exist
-- Run this in your Supabase SQL Editor

-- Create site_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.site_content (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  key text NOT NULL UNIQUE,
  value text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT site_content_pkey PRIMARY KEY (id)
);

-- Create testimonials table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.testimonials (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  location text,
  message text NOT NULL,
  amount numeric,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);

-- Enable RLS on both tables
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for site_content
DROP POLICY IF EXISTS "Public can view site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;

CREATE POLICY "Public can view site content"
ON public.site_content FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage site content"
ON public.site_content FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policies for testimonials
DROP POLICY IF EXISTS "Public can view active testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can view all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;

CREATE POLICY "Public can view active testimonials"
ON public.testimonials FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins can view all testimonials"
ON public.testimonials FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage testimonials"
ON public.testimonials FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create testimonials storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for testimonials bucket
DROP POLICY IF EXISTS "Authenticated users can upload testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view testimonial images" ON storage.objects;

CREATE POLICY "Authenticated users can upload testimonial images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'testimonials');

CREATE POLICY "Authenticated users can update testimonial images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'testimonials')
WITH CHECK (bucket_id = 'testimonials');

CREATE POLICY "Authenticated users can delete testimonial images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'testimonials');

CREATE POLICY "Public can view testimonial images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'testimonials');