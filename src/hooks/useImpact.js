import { useState } from 'react';
import {
    createImpact,
    getAllImpacts,
    getImpactsByDepartment,
    getImpactsByDonation,
    updateImpact,
    deleteImpact,
    getImpactStats,
} from '../supabase/impacts.js';

/**
 * Custom hook for impact operations
 */
export const useImpact = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const create = async (impactData) => {
        setLoading(true);
        setError(null);
        const result = await createImpact(impactData);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getAll = async (filters) => {
        setLoading(true);
        setError(null);
        const result = await getAllImpacts(filters);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getByDepartment = async (department) => {
        setLoading(true);
        setError(null);
        const result = await getImpactsByDepartment(department);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getByDonation = async (donationId) => {
        setLoading(true);
        setError(null);
        const result = await getImpactsByDonation(donationId);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const update = async (impactId, updateData) => {
        setLoading(true);
        setError(null);
        const result = await updateImpact(impactId, updateData);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const remove = async (impactId) => {
        setLoading(true);
        setError(null);
        const result = await deleteImpact(impactId);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getStats = async () => {
        setLoading(true);
        setError(null);
        const result = await getImpactStats();
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    return {
        create,
        getAll,
        getByDepartment,
        getByDonation,
        update,
        remove,
        getStats,
        loading,
        error,
    };
};
