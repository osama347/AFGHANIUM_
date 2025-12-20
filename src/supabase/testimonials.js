import { supabase } from './client.js';

const TABLE = 'testimonials';

/**
 * Get all active testimonials
 * @returns {Promise<object>} List of testimonials
 */
export const getTestimonials = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get all testimonials (for admin)
 * @returns {Promise<object>} List of all testimonials
 */
export const getAllTestimonials = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create a new testimonial
 * @param {object} testimonial - Testimonial data
 * @returns {Promise<object>} Created testimonial
 */
export const createTestimonial = async (testimonial) => {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .insert(testimonial)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update a testimonial
 * @param {number} id - Testimonial ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Updated testimonial
 */
export const updateTestimonial = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .update({ ...updates, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error updating testimonial:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete a testimonial
 * @param {number} id - Testimonial ID
 * @returns {Promise<object>} Deletion result
 */
export const deleteTestimonial = async (id) => {
    try {
        const { error } = await supabase
            .from(TABLE)
            .delete()
            .eq('id', id);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return { success: false, error: error.message };
    }
};