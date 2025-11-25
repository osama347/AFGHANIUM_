import { useState } from 'react';
import {
    uploadImage,
    getImageUrl,
    deleteImage,
    listImages,
} from '../supabase/storage.js';

/**
 * Custom hook for storage operations
 */
export const useStorage = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const upload = async (file, folder = 'general') => {
        setUploading(true);
        setError(null);
        setProgress(0);

        const result = await uploadImage(file, folder);

        setUploading(false);
        setProgress(100);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getUrl = (path) => {
        return getImageUrl(path);
    };

    const remove = async (path) => {
        setError(null);
        const result = await deleteImage(path);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const list = async (folder = '') => {
        setError(null);
        const result = await listImages(folder);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    return {
        upload,
        getUrl,
        remove,
        list,
        uploading,
        progress,
        error,
    };
};
