-- TEST SCRIPT: Check if testimonials setup is working
-- Run this in your Supabase SQL Editor to test the setup

-- Test 1: Check if tables exist
SELECT 'Checking tables...' as test;
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('testimonials', 'site_content');

-- Test 2: Check if bucket exists
SELECT 'Checking storage bucket...' as test;
SELECT id, name, public FROM storage.buckets WHERE id = 'testimonials';

-- Test 3: Check RLS policies
SELECT 'Checking RLS policies...' as test;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('testimonials', 'site_content')
ORDER BY tablename, policyname;

-- Test 4: Try to insert a test testimonial (this should work if you're authenticated)
-- Uncomment the lines below to test inserting data:
/*
INSERT INTO public.testimonials (name, message, is_active)
VALUES ('Test User', 'This is a test testimonial to verify the setup is working.', true);

SELECT 'Test testimonial inserted successfully' as result;
SELECT id, name, message, is_active FROM public.testimonials WHERE name = 'Test User';
*/

-- Test 5: Check current testimonials
SELECT 'Current testimonials in database:' as info;
SELECT id, name, location, message, amount, image_url, is_active, created_at
FROM public.testimonials
ORDER BY created_at DESC;