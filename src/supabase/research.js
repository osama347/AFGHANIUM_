import { supabase, TABLES } from './client.js';

/**
 * Submit a new research paper
 * @param {object} researchData - Research submission data
 * @returns {Promise<object>} Created research submission
 */
export const submitResearch = async (researchData) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.RESEARCH)
            .insert([
                {
                    title: researchData.title,
                    author: researchData.author,
                    email: researchData.email,
                    topic: researchData.topic || null,
                    abstract: researchData.abstract,
                    keywords: researchData.keywords || null,
                    additional_notes: researchData.message || null,
                    file_path: researchData.filePath || null,
                    file_name: researchData.fileName || null,
                    status: 'pending_review', // pending_review, approved, rejected
                    is_published: false,
                    submission_date: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error submitting research:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get all published research
 * @returns {Promise<object>} Array of published research
 */
export const getPublishedResearch = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLES.RESEARCH)
            .select('*')
            .eq('is_published', true)
            .eq('status', 'approved')
            .order('submission_date', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching published research:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get all research submissions (admin)
 * @returns {Promise<object>} Array of all research submissions
 */
export const getAllResearchSubmissions = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLES.RESEARCH)
            .select('*')
            .order('submission_date', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching research submissions:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get research submissions by status (admin)
 * @param {string} status - Submission status (pending_review, approved, rejected)
 * @returns {Promise<object>} Array of research submissions
 */
export const getResearchByStatus = async (status) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.RESEARCH)
            .select('*')
            .eq('status', status)
            .order('submission_date', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error(`Error fetching research with status ${status}:`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Get research by ID
 * @param {number} id - Research submission ID
 * @returns {Promise<object>} Research submission data
 */
export const getResearchById = async (id) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.RESEARCH)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching research:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update research submission status (admin)
 * @param {number} id - Research submission ID
 * @param {string} status - New status (approved, rejected, pending_review)
 * @param {string} adminNotes - Optional admin notes
 * @returns {Promise<object>} Updated research submission
 */
export const updateResearchStatus = async (id, status, adminNotes = null) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.RESEARCH)
            .update({
                status: status,
                admin_notes: adminNotes,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error updating research status:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Publish research (admin)
 * @param {number} id - Research submission ID
 * @returns {Promise<object>} Updated research submission
 */
export const publishResearch = async (id) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.RESEARCH)
            .update({
                is_published: true,
                status: 'approved',
                published_date: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error publishing research:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Reject research (admin)
 * @param {number} id - Research submission ID
 * @param {string} rejectionReason - Reason for rejection
 * @returns {Promise<object>} Updated research submission
 */
export const rejectResearch = async (id, rejectionReason = null) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.RESEARCH)
            .update({
                status: 'rejected',
                admin_notes: rejectionReason,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error rejecting research:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete research submission (admin)
 * @param {number} id - Research submission ID
 * @returns {Promise<object>} Result
 */
export const deleteResearch = async (id) => {
    try {
        const { error } = await supabase
            .from(TABLES.RESEARCH)
            .delete()
            .eq('id', id);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error deleting research:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get research statistics (admin)
 * @returns {Promise<object>} Research statistics
 */
export const getResearchStats = async () => {
    try {
        const [allRes, pendingRes, approvedRes, publishedRes] = await Promise.all([
            supabase.from(TABLES.RESEARCH).select('id', { count: 'exact', head: true }),
            supabase.from(TABLES.RESEARCH).select('id', { count: 'exact', head: true }).eq('status', 'pending_review'),
            supabase.from(TABLES.RESEARCH).select('id', { count: 'exact', head: true }).eq('status', 'approved'),
            supabase.from(TABLES.RESEARCH).select('id', { count: 'exact', head: true }).eq('is_published', true),
        ]);

        return {
            success: true,
            data: {
                total_submissions: allRes.count || 0,
                pending_review: pendingRes.count || 0,
                approved: approvedRes.count || 0,
                published: publishedRes.count || 0,
            },
        };
    } catch (error) {
        console.error('Error fetching research statistics:', error);
        return { success: false, error: error.message };
    }
};
