import { supabase, TABLES } from './client.js';

/**
 * Get all active emergency campaigns with donation stats
 * @returns {Promise<object>} Active emergency campaigns
 */
export const getActiveEmergencyCampaigns = async () => {
    try {
        const { data, error } = await supabase
            .from('emergency_campaigns_with_stats')
            .select('*')
            .eq('is_active', true)
            .order('priority', { ascending: true });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching active emergency campaigns:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get all emergency campaigns (Admin only)
 * @returns {Promise<object>} All emergency campaigns
 */
export const getAllEmergencyCampaigns = async () => {
    try {
        const { data, error } = await supabase
            .from('emergency_campaigns_with_stats')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching all emergency campaigns:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create a new emergency campaign (Admin only)
 * @param {object} campaignData - Campaign data
 * @returns {Promise<object>} Created campaign
 */
export const createEmergencyCampaign = async (campaignData) => {
    try {
        const { data, error } = await supabase
            .from('emergency_campaigns')
            .insert([campaignData])
            .select()
            .single();

        if (error) throw error;

        // Fetch the campaign with stats from the view
        const { data: campaignWithStats, error: viewError } = await supabase
            .from('emergency_campaigns_with_stats')
            .select('*')
            .eq('id', data.id)
            .single();

        if (viewError) {
            console.warn('Could not fetch campaign stats, returning basic data:', viewError);
            return { success: true, data };
        }

        return { success: true, data: campaignWithStats };
    } catch (error) {
        console.error('Error creating emergency campaign:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update emergency campaign (Admin only)
 * @param {string} id - Campaign ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Updated campaign
 */
export const updateEmergencyCampaign = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from('emergency_campaigns')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Fetch the updated campaign with stats from the view
        const { data: campaignWithStats, error: viewError } = await supabase
            .from('emergency_campaigns_with_stats')
            .select('*')
            .eq('id', id)
            .single();

        if (viewError) {
            console.warn('Could not fetch updated campaign stats, returning basic data:', viewError);
            return { success: true, data };
        }

        return { success: true, data: campaignWithStats };
    } catch (error) {
        console.error('Error updating emergency campaign:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Toggle campaign visibility (Admin only)
 * @param {string} id - Campaign ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<object>} Updated campaign
 */
export const toggleCampaignVisibility = async (id, isActive) => {
    try {
        const { data, error } = await supabase
            .from('emergency_campaigns')
            .update({ is_active: isActive })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error toggling campaign visibility:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete emergency campaign (Admin only)
 * @param {string} id - Campaign ID
 * @returns {Promise<object>} Deletion result
 */
export const deleteEmergencyCampaign = async (id) => {
    try {
        const { error } = await supabase
            .from('emergency_campaigns')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error deleting emergency campaign:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get emergency campaign by ID
 * @param {string} id - Campaign ID
 * @returns {Promise<object>} Campaign data
 */
export const getEmergencyCampaignById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('emergency_campaigns_with_stats')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching emergency campaign:', error);
        return { success: false, error: error.message };
    }
};
