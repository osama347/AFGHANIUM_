-- DEBUG: Check current storage policies and bucket status
-- Run this in Supabase SQL Editor to diagnose the RLS issue

-- Check buckets
SELECT '=== BUCKETS ===' as section;
SELECT id, name, public, created_at
FROM storage.buckets
WHERE id IN ('impact-photos', 'testimonials');

-- Check storage policies
SELECT '=== STORAGE POLICIES ===' as section;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'objects'
ORDER BY policyname;

-- Check current user/session (run this in your app console)
-- console.log(await supabase.auth.getSession())

-- Test basic storage access (this should work if policies are correct)
SELECT '=== BASIC STORAGE TEST ===' as section;
-- If this fails, the policies are wrong
SELECT 'Storage system is accessible' as status;