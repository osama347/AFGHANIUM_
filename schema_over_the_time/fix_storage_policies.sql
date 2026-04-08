-- Fix storage policies for impact-photos bucket
-- Run this in your Supabase SQL Editor to fix the RLS policy violations

-- First, ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('impact-photos', 'impact-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view impact photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload impact photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update impact photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete impact photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update testimonial images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete testimonial images" ON storage.objects;

-- Create proper policies for impact-photos bucket
CREATE POLICY "Public can view impact photos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'impact-photos');

CREATE POLICY "Authenticated users can upload impact photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'impact-photos');

CREATE POLICY "Authenticated users can update impact photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'impact-photos')
WITH CHECK (bucket_id = 'impact-photos');

CREATE POLICY "Authenticated users can delete impact photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'impact-photos');

-- Also create policies for testimonials bucket (in case it's still being used)
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view testimonial images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'testimonials');

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

-- Verification
SELECT 'Storage policies fixed successfully!' as status;
SELECT 'Buckets:' as info, id, name, public FROM storage.buckets WHERE id IN ('impact-photos', 'testimonials');
SELECT 'Storage Policies:' as info, schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'objects' ORDER BY policyname;