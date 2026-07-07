-- Create complaint_updates table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.complaint_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    admin_remarks TEXT DEFAULT '',
    updated_by TEXT DEFAULT 'Admin',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.complaint_updates ENABLE ROW LEVEL SECURITY;

-- Admin can insert/select all
CREATE POLICY "Admin can insert complaint_updates" 
    ON public.complaint_updates FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Admin can read complaint_updates" 
    ON public.complaint_updates FOR SELECT 
    USING (true);

-- Users can read updates for their own complaints
CREATE POLICY "Users can read own complaint_updates" 
    ON public.complaint_updates FOR SELECT 
    USING (
        complaint_id IN (
            SELECT id FROM public.complaints WHERE user_id = auth.uid()
        )
    );

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_complaint_updates_complaint_id 
    ON public.complaint_updates(complaint_id);

CREATE INDEX IF NOT EXISTS idx_complaint_updates_created_at 
    ON public.complaint_updates(created_at DESC);

-- Grant table-level access so RLS policies can take effect
GRANT SELECT, INSERT ON public.complaint_updates TO authenticated;
GRANT SELECT, INSERT ON public.complaint_updates TO anon;
