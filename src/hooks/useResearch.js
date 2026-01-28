import { useState } from 'react';
import {
    submitResearch,
    getPublishedResearch,
    getAllResearchSubmissions,
    getResearchByStatus,
    getResearchById,
    updateResearchStatus,
    publishResearch,
    rejectResearch,
    deleteResearch,
    getResearchStats,
} from '../supabase/research.js';

/**
 * Custom hook for research operations
 */
export const useResearch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submit = async (researchData) => {
        setLoading(true);
        setError(null);
        const result = await submitResearch(researchData);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getPublished = async () => {
        setLoading(true);
        setError(null);
        const result = await getPublishedResearch();
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getAll = async () => {
        setLoading(true);
        setError(null);
        const result = await getAllResearchSubmissions();
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getByStatus = async (status) => {
        setLoading(true);
        setError(null);
        const result = await getResearchByStatus(status);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getById = async (id) => {
        setLoading(true);
        setError(null);
        const result = await getResearchById(id);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const updateStatus = async (id, status, adminNotes) => {
        setLoading(true);
        setError(null);
        const result = await updateResearchStatus(id, status, adminNotes);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const publish = async (id) => {
        setLoading(true);
        setError(null);
        const result = await publishResearch(id);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const reject = async (id, rejectionReason) => {
        setLoading(true);
        setError(null);
        const result = await rejectResearch(id, rejectionReason);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const remove = async (id) => {
        setLoading(true);
        setError(null);
        const result = await deleteResearch(id);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getStats = async () => {
        setLoading(true);
        setError(null);
        const result = await getResearchStats();
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    return {
        loading,
        error,
        submit,
        getPublished,
        getAll,
        getByStatus,
        getById,
        updateStatus,
        publish,
        reject,
        remove,
        getStats,
    };
};
