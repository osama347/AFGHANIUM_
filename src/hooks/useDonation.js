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
    getDashboardMetrics,
} from '../supabase/donations.js';

/**
 * Custom hook for donation operations
 */
export const useDonation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const run = async (operation) => {
        setLoading(true);
        setError(null);

        const result = await operation();

        if (!result.success) {
            setError(result.error);
        }

        setLoading(false);
        return result;
    };

    const create = async (donationData) => {
        return run(() => createDonation(donationData));
    };

    const getById = async (donationId) => {
        return run(() => getDonationById(donationId));
    };

    const getByName = async (fullName) => {
        return run(() => getDonationsByName(fullName));
    };

    const updateStatus = async (donationId, status) => {
        return run(() => updateDonationStatus(donationId, status));
    };

    const getAll = async (filters) => {
        return run(() => getAllDonations(filters));
    };

    const getStats = async () => {
        return run(() => getDonationStats());
    };

    const getDailyStats = async () => {
        return run(() => getDailyDonationStats());
    };

    const getPaymentMethods = async () => {
        return run(() => getPaymentMethodsStats());
    };

    const getTimeSeries = async (days = 30) => {
        return run(() => getTimeSeriesData(days));
    };

    const getDashboardData = async (days = 30) => {
        return run(() => getDashboardMetrics(days));
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
        getDashboardData,
        loading,
        error,
    };
};
