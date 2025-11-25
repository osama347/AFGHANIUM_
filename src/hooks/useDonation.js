import { useState } from 'react';
import {
    createDonation,
    getDonationById,
    getDonationsByName,
    updateDonationStatus,
    getAllDonations,
    getDonationStats,
    getDailyDonationStats,
    getPaymentMethodsStats,
    getTimeSeriesData,
} from '../supabase/donations.js';

/**
 * Custom hook for donation operations
 */
export const useDonation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const create = async (donationData) => {
        setLoading(true);
        setError(null);
        const result = await createDonation(donationData);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getById = async (donationId) => {
        setLoading(true);
        setError(null);
        const result = await getDonationById(donationId);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getByName = async (fullName) => {
        setLoading(true);
        setError(null);
        const result = await getDonationsByName(fullName);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const updateStatus = async (donationId, status) => {
        setLoading(true);
        setError(null);
        const result = await updateDonationStatus(donationId, status);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getAll = async (filters) => {
        setLoading(true);
        setError(null);
        const result = await getAllDonations(filters);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getStats = async () => {
        setLoading(true);
        setError(null);
        const result = await getDonationStats();
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getDailyStats = async () => {
        setLoading(true);
        setError(null);
        const result = await getDailyDonationStats();
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getPaymentMethods = async () => {
        setLoading(true);
        setError(null);
        const result = await getPaymentMethodsStats();
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    const getTimeSeries = async (days = 30) => {
        setLoading(true);
        setError(null);
        const result = await getTimeSeriesData(days);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    return {
        create,
        getById,
        getByName,
        updateStatus,
        getAll,
        getStats,
        getDailyStats,
        getPaymentMethods,
        getTimeSeries,
        loading,
        error,
    };
};
