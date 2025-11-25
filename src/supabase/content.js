import { supabase } from './client.js';

const TABLE = 'site_content';

/**
 * Get content by key
 * @param {string} key - Content key
 * @returns {Promise<object>} Content value
 */
export const getContent = async (key) => {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .select('value')
            .eq('key', key)
            .single();

        if (error) {
            // If error is "Row not found", return null instead of error
            if (error.code === 'PGRST116') return { success: true, data: null };
            throw error;
        }

        return { success: true, data: data.value };
    } catch (error) {
        console.error('Error fetching content:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update content
 * @param {string} key - Content key
 * @param {string} value - Content value
 * @returns {Promise<object>} Updated content
 */
export const updateContent = async (key, value) => {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .upsert({ key, value })
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error updating content:', error);
        return { success: false, error: error.message };
    }
};
