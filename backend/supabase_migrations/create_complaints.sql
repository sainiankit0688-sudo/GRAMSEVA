-- ============================================================
-- GramSeva — Complaint Management Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================
-- This migration does NOT use a public.profiles table.
-- It uses only auth.uid() from the JWT for all RLS policies.
-- Admin role is checked via auth.jwt() -> 'app_metadata' ->> 'role'
-- To promote a user to admin, use the Supabase Auth Admin API:
--   supabase.auth.admin.updateUserById('uuid', {
--     app_metadata: { role: 'admin' }
--   })
-- ============================================================

-- ── Drop old policies (if re-running migration) ──────────────
DROP POLICY IF EXISTS "Users can insert their own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can read their own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can update their own pending complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admin can read all complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admin can update all complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admin can delete all complaints" ON public.complaints;
DROP POLICY IF EXISTS "Anyone can view complaint photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload complaint photos" ON storage.objects;
DROP POLICY IF EXISTS "Owners can update their complaint photos" ON storage.objects;
DROP POLICY IF EXISTS "Owners can delete their complaint photos" ON storage.objects;

-- ── Helper function for updated_at trigger ──────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Create complaints table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add table comment
COMMENT ON TABLE public.complaints IS 'User-submitted complaints with location and photo';

-- 3. Enable Row Level Security
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- 4. Create policies (using auth.uid() only — no profiles table needed)

-- 4a. Authenticated users can insert complaints
CREATE POLICY "Users can insert their own complaints"
ON public.complaints
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 4b. Users can read only their own complaints
CREATE POLICY "Users can read their own complaints"
ON public.complaints
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4c. Users can update only their own pending complaints
CREATE POLICY "Users can update their own pending complaints"
ON public.complaints
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'Pending')
WITH CHECK (auth.uid() = user_id AND status = 'Pending');

-- 4d. Admin can read all complaints
-- Admin role is set via JWT app_metadata claim (no profiles table query)
CREATE POLICY "Admin can read all complaints"
ON public.complaints
FOR SELECT
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- 4e. Admin can update all complaints (e.g. change status)
CREATE POLICY "Admin can update all complaints"
ON public.complaints
FOR UPDATE
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- 4f. Admin can delete any complaint (permanent removal)
CREATE POLICY "Admin can delete all complaints"
ON public.complaints
FOR DELETE
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON public.complaints (user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints (status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON public.complaints (category);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON public.complaints (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_user_status ON public.complaints (user_id, status);

-- 6. Create updated_at trigger (auto-set on row update)
DROP TRIGGER IF EXISTS trg_complaints_updated_at ON public.complaints;
CREATE TRIGGER trg_complaints_updated_at
    BEFORE UPDATE ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- 7. Create Storage bucket for complaint photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'complaints',
    'complaints',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[];

-- 8. Storage bucket policy: anyone can view complaint photos
CREATE POLICY "Anyone can view complaint photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'complaints');

-- 9. Storage bucket policy: only owner can upload/update/delete
CREATE POLICY "Authenticated users can upload complaint photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'complaints'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owners can update their complaint photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'complaints'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owners can delete their complaint photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'complaints'
    AND (storage.foldername(name))[1] = auth.uid()::text
);
