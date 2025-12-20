-- Allow anonymous uploads to public impact-photos bucket
-- Run this in Supabase SQL Editor to allow uploads without authentication

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view impact photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload impact photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update impact photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete impact photos" ON storage.objects;

-- Allow anyone to view images (public bucket)
CREATE POLICY "Public can view impact photos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'impact-photos');

-- Allow anyone to upload to hero folder (for slideshow)
CREATE POLICY "Anyone can upload to hero folder"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'impact-photos' AND (storage.foldername(name))[1] = 'hero');

-- Allow anyone to delete from hero folder
CREATE POLICY "Anyone can delete from hero folder"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'impact-photos' AND (storage.foldername(name))[1] = 'hero');

-- Allow authenticated users to manage all impact photos (for testimonials, etc.)
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

-- Verification
SELECT 'Anonymous upload policies created successfully!' as status;