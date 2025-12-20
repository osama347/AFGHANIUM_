import { supabase, BUCKETS } from './client.js';

/**
 * Upload image to Supabase Storage
 * @param {File} file - Image file
 * @param {string} folder - Optional folder name
 * @returns {Promise<object>} Upload result with public URL
 */
export const uploadImage = async (file, folder = 'general') => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload file
        const { data, error } = await supabase.storage
            .from(BUCKETS.IMPACT_PHOTOS)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKETS.IMPACT_PHOTOS)
            .getPublicUrl(fileName);

        return {
            success: true,
            data: {
                path: data.path,
                publicUrl,
            },
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get public URL for an image
 * @param {string} path - Image path in storage
 * @returns {string} Public URL
 */
export const getImageUrl = (path) => {
    if (!path) return null;

    const { data } = supabase.storage
        .from(BUCKETS.IMPACT_PHOTOS)
        .getPublicUrl(path);

    return data.publicUrl;
};

/**
 * Delete image from storage
 * @param {string} path - Image path
 * @returns {Promise<object>} Result
 */
export const deleteImage = async (path) => {
    try {
        const { error } = await supabase.storage
            .from(BUCKETS.IMPACT_PHOTOS)
            .remove([path]);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error deleting image:', error);
        return { success: false, error: error.message };
    }
};

/**
 * List all images in a folder
 * @param {string} folder - Folder name
 * @returns {Promise<object>} Array of files
 */
export const listImages = async (folder = '') => {
    try {
        const { data, error } = await supabase.storage
            .from(BUCKETS.IMPACT_PHOTOS)
            .list(folder, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error listing images:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Upload image to public bucket (no auth required)
 * @param {File} file - Image file
 * @param {string} folder - Folder name (default: 'hero')
 * @returns {Promise<object>} Upload result with public URL
 */
export const uploadSlideshowImage = async (file, folder = 'hero') => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload file to public bucket
        const { data, error } = await supabase.storage
            .from(BUCKETS.IMPACT_PHOTOS)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKETS.IMPACT_PHOTOS)
            .getPublicUrl(fileName);

        return {
            success: true,
            data: {
                path: fileName,
                publicUrl,
            },
        };
    } catch (error) {
        console.error('Error uploading slideshow image:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get testimonial image URL
 * @param {string} path - Image path in storage
 * @returns {string} Public URL
 */
export const getTestimonialImageUrl = (path) => {
    if (!path) return null;

    const { data } = supabase.storage
        .from(BUCKETS.IMPACT_PHOTOS)
        .getPublicUrl(path);

    return data.publicUrl;
};

/**
 * List images from a specific folder in the bucket
 * @param {string} folder - Folder name (default: 'hero')
 * @returns {Promise<object>} Array of image objects
 */
export const listSlideshowImages = async (folder = 'hero') => {
    try {
        const { data, error } = await supabase.storage
            .from(BUCKETS.IMPACT_PHOTOS)
            .list(folder, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (error) throw error;

        // Convert to full paths and public URLs
        const images = data.map(file => {
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKETS.IMPACT_PHOTOS)
                .getPublicUrl(`${folder}/${file.name}`);
            return publicUrl;
        });

        return { success: true, data: images };
    } catch (error) {
        console.error('Error listing slideshow images:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete image from bucket
 * @param {string} path - Full path to image (e.g., 'hero/filename.jpg')
 * @returns {Promise<object>} Result
 */
export const deleteSlideshowImage = async (path) => {
    try {
        const { error } = await supabase.storage
            .from(BUCKETS.IMPACT_PHOTOS)
            .remove([path]);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error deleting slideshow image:', error);
        return { success: false, error: error.message };
    }
};
