-- Departments schema for dynamic department management
-- Run in Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.departments (
  id text PRIMARY KEY,
  name_en text NOT NULL,
  name_dari text,
  name_pashto text,
  description_en text,
  description_dari text,
  description_pashto text,
  icon text DEFAULT '🏥'::text,
  display_order integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active departments" ON public.departments;
CREATE POLICY "Public can view active departments"
ON public.departments
FOR SELECT
TO anon, authenticated
USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage departments" ON public.departments;
CREATE POLICY "Admins can manage departments"
ON public.departments
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
