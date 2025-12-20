import { supabase } from './client.js';
import { listSlideshowImages } from './storage.js';

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

/**
 * Get slideshow images from bucket
 * @returns {Promise<object>} Array of slideshow image URLs
 */
export const getSlideshowImages = async () => {
    try {
        const result = await listSlideshowImages('hero');
        if (result.success && result.data.length > 0) {
            return { success: true, data: result.data };
        }

        // Fallback to default images if no images in bucket
        return {
            success: true,
            data: [
                '/cover-photo.png',
                '/53406943284_7830e45eb9_o (1) (1).jpg',
                '/pict_large.jpg',
                '/rs4317_christian-jepsen-9661.webp'
            ]
        };
    } catch (error) {
        console.error('Error fetching slideshow images:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update slideshow images (no-op since we fetch from bucket)
 * @param {Array} images - Array of image URLs (ignored)
 * @returns {Promise<object>} Success result
 */
export const updateSlideshowImages = async (images) => {
    // Since we fetch images directly from the bucket, we don't need to store them in DB
    // The images are automatically available when uploaded to the hero folder
    return { success: true };
};
