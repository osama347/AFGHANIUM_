import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase credentials are provided
const hasSupabaseConfig = supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    supabaseUrl !== 'your_supabase_project_url';

// Create Supabase client only if credentials are valid
export const supabase = hasSupabaseConfig
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Log warning if Supabase is not configured
if (!hasSupabaseConfig) {
    console.warn('⚠️ Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env file.');
}

// Database table names
// Database table names
export const TABLES = {
    DONATIONS: 'donations',
    IMPACTS: 'impacts',
    ADMINS: 'admins',
    RESEARCH: 'research_submissions',
};

// Storage bucket names
export const BUCKETS = {
    IMPACT_PHOTOS: 'impact-photos',
    TESTIMONIALS: 'testimonials',
    RESEARCH_FILES: 'research-files',
};
