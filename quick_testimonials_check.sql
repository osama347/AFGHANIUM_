-- QUICK TEST: Check if testimonials bucket exists
-- Run this in your Supabase SQL Editor

SELECT 'Checking testimonials bucket...' as status;
SELECT id, name, public, created_at FROM storage.buckets WHERE id = 'testimonials';

-- If no results, the bucket doesn't exist and you need to create it
-- If it exists, check the policies below

SELECT 'Checking storage policies...' as status;
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%testimonial%'
ORDER BY policyname;

-- Test inserting a simple testimonial (run this if the above works)
-- INSERT INTO public.testimonials (name, message, is_active)
-- VALUES ('Test User', 'This is a test to verify the setup works.', true);