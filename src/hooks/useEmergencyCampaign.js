import { useState } from 'react';
import {
    getActiveEmergencyCampaigns,
    getAllEmergencyCampaigns,
    createEmergencyCampaign,
    updateEmergencyCampaign,
    toggleCampaignVisibility,
    deleteEmergencyCampaign,
    getEmergencyCampaignById,
} from '../supabase/emergencyCampaigns';

/**
 * Custom hook for emergency campaign operations
 */
export const useEmergencyCampaign = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getActive = async () => {
        setLoading(true);
        setError(null);
        const result = await getActiveEmergencyCampaigns();
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getAll = async () => {
        setLoading(true);
        setError(null);
        const result = await getAllEmergencyCampaigns();
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const create = async (campaignData) => {
        setLoading(true);
        setError(null);
        const result = await createEmergencyCampaign(campaignData);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const update = async (id, updates) => {
        setLoading(true);
        setError(null);
        const result = await updateEmergencyCampaign(id, updates);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const toggleVisibility = async (id, isActive) => {
        setLoading(true);
        setError(null);
        const result = await toggleCampaignVisibility(id, isActive);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const remove = async (id) => {
        setLoading(true);
        setError(null);
        const result = await deleteEmergencyCampaign(id);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getById = async (id) => {
        setLoading(true);
        setError(null);
        const result = await getEmergencyCampaignById(id);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    return {
        getActive,
        getAll,
        create,
        update,
        toggleVisibility,
        remove,
        getById,
        loading,
        error,
    };
};
