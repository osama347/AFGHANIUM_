import { supabase, TABLES } from './client.js';

const impactEmailMode = (import.meta.env.VITE_IMPACT_EMAIL_MODE || 'client').toLowerCase();

const notifyImpactEmail = async (impactRow) => {
    if (impactEmailMode !== 'client') {
        return {
            attempted: false,
            sent: false,
            reason: 'email-delivery-disabled',
            mode: impactEmailMode,
        };
    }

    if (!impactRow?.donation_id || !supabase) {
        return { attempted: false, sent: false, reason: 'missing-donation-id-or-client' };
    }

    try {
        const { data: donation, error: donationError } = await supabase
            .from(TABLES.DONATIONS)
            .select('donation_id, full_name, email')
            .eq('donation_id', impactRow.donation_id)
            .single();

        if (donationError || !donation?.email) {
            return {
                attempted: true,
                sent: false,
                reason: 'donor-not-found',
                error: donationError?.message || 'Donor record missing email',
            };
        }

        const { error: functionError } = await supabase.functions.invoke('send-impact-notification', {
            body: {
                donation_id: donation.donation_id,
                donor_name: donation.full_name,
                donor_email: donation.email,
                title: impactRow.title,
                description: impactRow.description,
                cost: impactRow.cost,
                image_url: impactRow.image_url,
                media: impactRow.media || [],
            },
        });

        if (functionError) {
            return {
                attempted: true,
                sent: false,
                reason: 'function-error',
                error: functionError.message,
            };
        }

        return { attempted: true, sent: true };
    } catch (error) {
        return {
            attempted: true,
            sent: false,
            reason: 'unexpected-error',
            error: error.message,
        };
    }
};

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

        const emailNotification = await notifyImpactEmail(data);

        if (emailNotification.attempted && !emailNotification.sent) {
            console.warn('⚠️ Impact saved, but email notification failed:', emailNotification);
        }

        if (emailNotification.reason === 'email-delivery-disabled') {
            console.info('ℹ️ Impact saved and email delivery skipped by VITE_IMPACT_EMAIL_MODE setting.');
        }

        return { success: true, data, emailNotification };
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
