-- Research Submissions Table
CREATE TABLE IF NOT EXISTS public.research_submissions (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    email TEXT NOT NULL,
    topic TEXT,
    abstract TEXT NOT NULL,
    keywords TEXT,
    additional_notes TEXT,
    file_name TEXT,
    file_path TEXT,
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
    is_published BOOLEAN DEFAULT FALSE,
    admin_notes TEXT,
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    published_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_research_status ON public.research_submissions(status);
CREATE INDEX idx_research_is_published ON public.research_submissions(is_published);
CREATE INDEX idx_research_email ON public.research_submissions(email);
CREATE INDEX idx_research_created_at ON public.research_submissions(created_at);
CREATE INDEX idx_research_submission_date ON public.research_submissions(submission_date);

-- Enable RLS (Row Level Security)
ALTER TABLE public.research_submissions ENABLE ROW LEVEL SECURITY;

-- Public can view published research
CREATE POLICY "Enable read access for published research"
    ON public.research_submissions
    FOR SELECT
    USING (is_published = true AND status = 'approved');

-- Authenticated users (admins) can view all research
CREATE POLICY "Enable read access for authenticated users"
    ON public.research_submissions
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Public can insert research submissions
CREATE POLICY "Enable insert for research submissions"
    ON public.research_submissions
    FOR INSERT
    WITH CHECK (true);

-- Only authenticated users can update research
CREATE POLICY "Enable update for authenticated users"
    ON public.research_submissions
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can delete research
CREATE POLICY "Enable delete for authenticated users"
    ON public.research_submissions
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create storage bucket for research files
-- Run this in Supabase dashboard: Create a public bucket named 'research-files'
-- Then add this policy:
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('research-files', 'research-files', true);
