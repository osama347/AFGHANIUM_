-- Create testimonials storage bucket and set up policies
-- Run this in your Supabase SQL Editor

-- Create the testimonials bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload testimonial images
CREATE POLICY "Authenticated users can upload testimonial images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'testimonials');

-- Allow authenticated users to update testimonial images
CREATE POLICY "Authenticated users can update testimonial images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'testimonials')
WITH CHECK (bucket_id = 'testimonials');

-- Allow authenticated users to delete testimonial images
CREATE POLICY "Authenticated users can delete testimonial images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'testimonials');

-- Allow public to view testimonial images (since testimonials are public)
CREATE POLICY "Public can view testimonial images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'testimonials');