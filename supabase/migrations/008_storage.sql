-- Enable storage extension if not already enabled (usually enabled by default in Supabase)
-- CREATE EXTENSION IF NOT EXISTS "storage";

-- Create a new private bucket for certificates
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'certificates', 
  'certificates', 
  false, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET 
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

-- RLS Policies for Storage
-- Note: 'storage.objects' is the table where files are stored

-- Policy: Allow users to upload their own certificates
CREATE POLICY "Users can upload their own certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'certificates' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to view their own certificates
CREATE POLICY "Users can view their own certificates"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'certificates' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to update their own certificates
CREATE POLICY "Users can update their own certificates"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'certificates' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to delete their own certificates
CREATE POLICY "Users can delete their own certificates"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'certificates' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
