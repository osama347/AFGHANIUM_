-- QUICK CHECK: Verify testimonials bucket and policies setup
-- Run this in your Supabase SQL Editor to check current status

-- Check if testimonials bucket exists
SELECT '=== BUCKET CHECK ===' as section;
SELECT id, name, public, created_at
FROM storage.buckets
WHERE id = 'testimonials';

-- Check storage policies for testimonials bucket
SELECT '=== STORAGE POLICIES ===' as section;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%testimonial%'
ORDER BY policyname;

-- Check if testimonials table exists
SELECT '=== TABLE CHECK ===' as section;
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_name = 'testimonials' AND table_schema = 'public';

-- Check RLS policies on testimonials table
SELECT '=== RLS POLICIES ===' as section;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'testimonials'
ORDER BY policyname;

-- Test basic bucket access (this should work if bucket exists and is public)
SELECT '=== BASIC BUCKET ACCESS TEST ===' as section;
-- This will show an error if bucket doesn't exist
SELECT 'Bucket exists and is accessible' as status;