import { useState } from 'react';
import {
    uploadImage,
    getImageUrl,
    deleteImage,
    listImages,
    uploadFile,
    deleteFile,
} from '../supabase/storage.js';

/**
 * Custom hook for storage operations
 */
export const useStorage = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const upload = async (file, bucket = 'impact-photos', folder = 'general') => {
        setUploading(true);
        setError(null);
        setProgress(0);

        // Use uploadFile for generic file uploads, uploadImage for images
        const isImage = file.type.startsWith('image/');
        const result = isImage 
            ? await uploadImage(file, folder)
            : await uploadFile(file, bucket, folder);

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

    const remove = async (path, bucket = 'impact-photos') => {
        setError(null);
        const result = bucket === 'impact-photos' 
            ? await deleteImage(path)
            : await deleteFile(path, bucket);

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
