-- Fix for Impact Insert Policy
-- This adds the missing RLS policy to allow admins to create impacts

-- 1. First, ensure RLS is enabled on the impacts table
ALTER TABLE public.impacts ENABLE ROW LEVEL SECURITY;

-- 2. Create policy to allow authenticated users (admins) to INSERT impacts
CREATE POLICY "Admins can create impacts"
ON public.impacts FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Create policy to allow admins to UPDATE impacts
CREATE POLICY "Admins can update impacts"
ON public.impacts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Create policy to allow admins to DELETE impacts
CREATE POLICY "Admins can delete impacts"
ON public.impacts FOR DELETE
TO authenticated
USING (true);

-- 5. Keep the existing SELECT policy for public viewing
DROP POLICY IF EXISTS "Public can view impacts" ON public.impacts;
CREATE POLICY "Public can view impacts"
ON public.impacts FOR SELECT
TO anon, authenticated
USING (true);

-- Verify policies are in place
SELECT tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'impacts'
ORDER BY policyname;
