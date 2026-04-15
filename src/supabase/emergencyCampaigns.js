import { supabase } from './client.js';

const TABLE_NAME = 'emergency_campaigns';

const withDefaultStats = (campaign) => ({
    ...campaign,
    current_amount: Number(campaign.current_amount || 0),
    donation_count: Number(campaign.donation_count || 0),
    progress_percentage: Number(campaign.progress_percentage || 0),
});

const attachCampaignStats = async (campaigns) => {
    if (!campaigns || campaigns.length === 0) {
        return [];
    }

    return campaigns.map((campaign) => {
        const currentAmount = Number(campaign.current_amount || 0);
        const goalAmount = Number(campaign.goal_amount || 0);
        const progressPercentage = goalAmount > 0
            ? Number(((currentAmount / goalAmount) * 100).toFixed(2))
            : Number(campaign.progress_percentage || 0);

        return withDefaultStats({
            ...campaign,
            current_amount: currentAmount,
            donation_count: Number(campaign.donation_count || 0),
            progress_percentage: progressPercentage,
        });
    });
};

const fetchCampaigns = async ({ onlyActive = false, singleId = null, orderByPriority = false } = {}) => {
    let tableQuery = supabase.from(TABLE_NAME).select('*');
    if (onlyActive) tableQuery = tableQuery.eq('is_active', true);
    if (singleId) tableQuery = tableQuery.eq('id', singleId);
    if (orderByPriority) tableQuery = tableQuery.order('priority', { ascending: true });
    tableQuery = tableQuery.order('created_at', { ascending: false });

    const { data: tableData, error: tableError } = singleId
        ? await tableQuery.single()
        : await tableQuery;

    if (tableError) throw tableError;

    if (singleId) {
        const enriched = await attachCampaignStats([tableData]);
        return { success: true, data: enriched[0] };
    }

    const enriched = await attachCampaignStats(tableData || []);
    return { success: true, data: enriched };
};

/**
 * Get all active emergency campaigns with donation stats
 * @returns {Promise<object>} Active emergency campaigns
 */
export const getActiveEmergencyCampaigns = async () => {
    try {
        return await fetchCampaigns({ onlyActive: true, orderByPriority: true });
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
        return await fetchCampaigns();
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

        return await fetchCampaigns({ singleId: data.id });
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

        return await fetchCampaigns({ singleId: id });
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
        return await fetchCampaigns({ singleId: id });
    } catch (error) {
        console.error('Error fetching emergency campaign:', error);
        return { success: false, error: error.message };
    }
};
