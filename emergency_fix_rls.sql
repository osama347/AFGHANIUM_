-- EMERGENCY FIX: Allow completely anonymous access to hero folder
-- Run this in Supabase SQL Editor - this should fix the RLS error

-- Drop ALL existing policies for impact-photos bucket
DROP POLICY IF EXISTS "Public can view impact photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload impact photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update impact photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete impact photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to hero folder" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from hero folder" ON storage.objects;

-- Allow COMPLETELY open access to hero folder
CREATE POLICY "Open access to hero folder"
ON storage.objects FOR ALL
TO anon, authenticated
USING (bucket_id = 'impact-photos' AND (storage.foldername(name))[1] = 'hero')
WITH CHECK (bucket_id = 'impact-photos' AND (storage.foldername(name))[1] = 'hero');

-- Allow public viewing of ALL impact photos
CREATE POLICY "Public view all impact photos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'impact-photos');

-- Keep authenticated access for other folders
CREATE POLICY "Authenticated manage other impact photos"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'impact-photos' AND (storage.foldername(name))[1] != 'hero')
WITH CHECK (bucket_id = 'impact-photos' AND (storage.foldername(name))[1] != 'hero');

SELECT 'Emergency fix applied - hero folder is now completely open!' as status;