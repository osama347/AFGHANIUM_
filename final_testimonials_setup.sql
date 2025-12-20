-- COMPLETE TESTIMONIALS SETUP - RUN THIS ENTIRE SCRIPT
-- This includes everything needed for testimonials to work

-- Step 1: Create tables
CREATE TABLE IF NOT EXISTS public.site_content (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  key text NOT NULL UNIQUE,
  value text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT site_content_pkey PRIMARY KEY (id)
);

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

-- Step 2: Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies
DROP POLICY IF EXISTS "Public can view site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;
DROP POLICY IF EXISTS "Public can view active testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can view all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;

-- Step 4: Create table policies
CREATE POLICY "Public can view site content"
ON public.site_content FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage site content"
ON public.site_content FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

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

-- Step 5: Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

-- Step 6: Drop existing storage policies
DROP POLICY IF EXISTS "Authenticated users can upload testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view testimonial images" ON storage.objects;

-- Step 7: Create storage policies
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

-- Step 8: Verification
SELECT 'Setup completed successfully!' as status;
SELECT 'Tables:' as info, table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('testimonials', 'site_content');

SELECT 'Buckets:' as info, id, name, public FROM storage.buckets WHERE id = 'testimonials';

SELECT 'RLS Policies:' as info, schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('testimonials', 'site_content')
ORDER BY tablename;