/*
# Create foods storage bucket

## Purpose
Creates a public storage bucket for food listing images, matching the existing products/services/avatars buckets.

## Changes
- Creates `foods` bucket (public)
- Adds storage RLS: anyone can read, authenticated can write/update/delete

## Security
- Public read (marketplace images)
- Write restricted to authenticated users
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('foods', 'foods', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view food images" ON storage.objects;
CREATE POLICY "Public can view food images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'foods');

DROP POLICY IF EXISTS "Users can upload food images" ON storage.objects;
CREATE POLICY "Users can upload food images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'foods');

DROP POLICY IF EXISTS "Users can update food images" ON storage.objects;
CREATE POLICY "Users can update food images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'foods')
WITH CHECK (bucket_id = 'foods');

DROP POLICY IF EXISTS "Users can delete food images" ON storage.objects;
CREATE POLICY "Users can delete food images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'foods');
