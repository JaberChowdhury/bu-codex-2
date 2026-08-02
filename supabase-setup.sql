-- Create the registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name TEXT NOT NULL,
    team_code TEXT NOT NULL,
    members JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create an RLS policy that allows ANYONE (anonymous users) to INSERT rows
CREATE POLICY "Allow anonymous inserts" 
ON public.registrations 
FOR INSERT 
TO anon
WITH CHECK (true);

-- (Optional) If you want to view the data yourself in the dashboard, you should allow the service role or authenticated users to read it:
CREATE POLICY "Allow authenticated read access"
ON public.registrations
FOR SELECT
TO authenticated
USING (true);

-- ==========================================
-- STORAGE BUCKET SETUP FOR PHOTOS
-- ==========================================

-- Create a storage bucket named "photos" if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true) 
ON CONFLICT (id) DO NOTHING;

-- Allow public anonymous uploads to the photos bucket
CREATE POLICY "Allow anonymous uploads to photos"
ON storage.objects 
FOR INSERT 
TO anon 
WITH CHECK ( bucket_id = 'photos' );

-- Allow public reading of photos (so the images display correctly)
CREATE POLICY "Allow public read access to photos"
ON storage.objects
FOR SELECT
TO public
USING ( bucket_id = 'photos' );
