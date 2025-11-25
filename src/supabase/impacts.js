import { supabase, TABLES } from './client.js';

/**
 * Create a new impact proof
 * @param {object} impactData - Impact data
 * @returns {Promise<object>} Created impact
 */
export const createImpact = async (impactData) => {
    try {
        const insertData = {
            title: impactData.title,
            description: impactData.description,
            cost: impactData.cost,
            department: impactData.department,
            image_url: impactData.imageUrl, // Keep for backward compatibility
            media: impactData.media || [], // New field for multiple media
            donation_id: impactData.donationId || null,
            admin_comment: impactData.adminComment || null,
            created_at: new Date().toISOString(),
        };

        console.log('🗄️ Inserting into database:', insertData);
        console.log('📸 Media array:', insertData.media, 'Length:', insertData.media.length);

        const { data, error } = await supabase
            .from(TABLES.IMPACTS)
            .insert([insertData])
            .select()
            .single();

        if (error) throw error;

        console.log('✅ Database insert successful:', data);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Error creating impact:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get all impacts
 * @param {object} filters - Optional filters
 * @returns {Promise<object>} Array of impacts
 */
export const getAllImpacts = async (filters = {}) => {
    try {
        let query = supabase
            .from(TABLES.IMPACTS)
            .select('*');

        if (filters.department) {
            query = query.eq('department', filters.department);
        }

        if (filters.donationId) {
            query = query.eq('donation_id', filters.donationId);
        }

        // Order by newest first
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching impacts:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get impacts by department
 * @param {string} department - Department ID
 * @returns {Promise<object>} Array of impacts
 */
export const getImpactsByDepartment = async (department) => {
    return getAllImpacts({ department });
};

/**
 * Get impacts by donation ID
 * @param {string} donationId - Donation ID
 * @returns {Promise<object>} Array of impacts
 */
export const getImpactsByDonation = async (donationId) => {
    return getAllImpacts({ donationId });
};

/**
 * Update impact
 * @param {number} impactId - Impact ID
 * @param {object} updateData - Data to update
 * @returns {Promise<object>} Updated impact
 */
export const updateImpact = async (impactId, updateData) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.IMPACTS)
            .update({
                ...updateData,
                updated_at: new Date().toISOString(),
            })
            .eq('id', impactId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error updating impact:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete impact
 * @param {number} impactId - Impact ID
 * @returns {Promise<object>} Result
 * @returns {Promise<object>} Result
 */
export const deleteImpact = async (impactId) => {
    try {
        const { error } = await supabase
            .from(TABLES.IMPACTS)
            .delete()
            .eq('id', impactId);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error deleting impact:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get impact statistics
 * @returns {Promise<object>} Statistics data
 */
export const getImpactStats = async () => {
    try {
        const { count, error } = await supabase
            .from(TABLES.IMPACTS)
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        return { success: true, data: { totalImpacts: count } };
    } catch (error) {
        console.error('Error fetching impact stats:', error);
        return { success: false, error: error.message };
    }
};
