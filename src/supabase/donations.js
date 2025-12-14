import { supabase, TABLES } from './client.js';
import { generateDonationId } from '../utils/formatters.js';

/**
 * Create a new donation
 * @param {object} donationData - Donation data
 * @returns {Promise<object>} Created donation with ID
 */
export const createDonation = async (donationData) => {
    try {
        const donationId = generateDonationId();

        const { data, error } = await supabase
            .from(TABLES.DONATIONS)
            .insert([
                {
                    donation_id: donationId,
                    full_name: donationData.fullName,
                    email: donationData.email,
                    amount: donationData.amount,
                    department: donationData.department,
                    payment_method: donationData.paymentMethod,
                    transaction_reference: donationData.transactionReference || null,
                    message: donationData.message || null,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (error) throw error;

        return { success: true, data, donationId };
    } catch (error) {
        console.error('Error creating donation:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get donation by ID
 * @param {string} donationId - Donation ID (AFG-XXXXXX format)
 * @returns {Promise<object>} Donation data
 */
export const getDonationById = async (donationId) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.DONATIONS)
            .select('*')
            .eq('donation_id', donationId.toUpperCase())
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching donation:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get donations by full name
 * @param {string} fullName - Donor's full name
 * @returns {Promise<object>} Array of donations
 */
export const getDonationsByName = async (fullName) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.DONATIONS)
            .select('*')
            .ilike('full_name', `%${fullName}%`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching donations by name:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update donation status
 * @param {string} donationId - Donation ID
 * @param {string} status - New status (pending, completed, failed, cancelled)
 * @returns {Promise<object>} Updated donation
 */
export const updateDonationStatus = async (donationId, status) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.DONATIONS)
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .eq('donation_id', donationId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error updating donation status:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update donation transaction reference
 * @param {string} donationId - Donation ID
 * @param {string} transactionReference - Transaction reference number
 * @returns {Promise<object>} Updated donation
 */
export const updateDonationTransactionReference = async (donationId, transactionReference) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.DONATIONS)
            .update({
                transaction_reference: transactionReference,
                updated_at: new Date().toISOString(),
            })
            .eq('donation_id', donationId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error updating transaction reference:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get all donations (Admin only)
 * @param {object} filters - Optional filters (status, department, dateRange)
 * @returns {Promise<object>} Array of donations
 */
export const getAllDonations = async (filters = {}) => {
    try {
        let query = supabase
            .from(TABLES.DONATIONS)
            .select('*');

        // Apply filters
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        if (filters.department) {
            query = query.eq('department', filters.department);
        }

        if (filters.startDate) {
            query = query.gte('created_at', filters.startDate);
        }

        if (filters.endDate) {
            query = query.lte('created_at', filters.endDate);
        }

        // Order by newest first
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching all donations:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get donation statistics
 * @returns {Promise<object>} Statistics data
 */
export const getDonationStats = async () => {
    try {
        // Get total donations (all statuses except failed/cancelled)
        const { count: totalCount, error: countError } = await supabase
            .from(TABLES.DONATIONS)
            .select('*', { count: 'exact', head: true })
            .neq('status', 'failed')
            .neq('status', 'cancelled');

        if (countError) throw countError;

        // Get pending donations count
        const { count: pendingCount, error: pendingError } = await supabase
            .from(TABLES.DONATIONS)
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        if (pendingError) throw pendingError;

        // Get total amount (all valid donations)
        const { data: amountData, error: amountError } = await supabase
            .from(TABLES.DONATIONS)
            .select('amount')
            .neq('status', 'failed')
            .neq('status', 'cancelled');

        if (amountError) throw amountError;

        const totalAmount = amountData.reduce((sum, donation) => sum + donation.amount, 0);

        // Get this month's donations
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0, 0, 0, 0);

        const { count: monthCount, error: monthError } = await supabase
            .from(TABLES.DONATIONS)
            .select('*', { count: 'exact', head: true })
            .gte('created_at', firstDayOfMonth.toISOString())
            .neq('status', 'failed')
            .neq('status', 'cancelled');

        if (monthError) throw monthError;

        // Get donations by department
        const { data: departmentData, error: deptError } = await supabase
            .from(TABLES.DONATIONS)
            .select('department, amount')
            .neq('status', 'failed')
            .neq('status', 'cancelled');

        if (deptError) throw deptError;

        const byDepartment = departmentData.reduce((acc, donation) => {
            if (!acc[donation.department]) {
                acc[donation.department] = { count: 0, amount: 0 };
            }
            acc[donation.department].count++;
            acc[donation.department].amount += donation.amount;
            return acc;
        }, {});

        return {
            success: true,
            data: {
                totalDonations: totalCount,
                pendingDonations: pendingCount,
                totalAmount,
                monthlyDonations: monthCount,
                byDepartment,
            },
        };
    } catch (error) {
        console.error('Error fetching donation stats:', error);
        return { success: false, error: error.message };
    }
};
/**
 * Get daily donation statistics for the last 30 days
 * @returns {Promise<object>} Daily stats data
 */
export const getDailyDonationStats = async () => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from(TABLES.DONATIONS)
            .select('amount, created_at')
            .neq('status', 'failed')
            .neq('status', 'cancelled')
            .gte('created_at', thirtyDaysAgo.toISOString())
            .order('created_at', { ascending: true });

        if (error) throw error;

        // Group by date
        const dailyStats = {};

        // Initialize last 30 days with 0
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
            dailyStats[dateStr] = { date: dateStr, count: 0, amount: 0 };
        }

        // Fill with actual data
        data.forEach(donation => {
            const dateStr = new Date(donation.created_at).toISOString().split('T')[0];
            if (dailyStats[dateStr]) {
                dailyStats[dateStr].count++;
                dailyStats[dateStr].amount += donation.amount;
            }
        });

        // Convert to array and sort by date
        const result = Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date));

        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching daily stats:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get payment methods statistics
 * @returns {Promise<object>} Payment methods breakdown
 */
export const getPaymentMethodsStats = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLES.DONATIONS)
            .select('payment_method, amount')
            .neq('status', 'failed')
            .neq('status', 'cancelled');

        if (error) throw error;

        const stats = data.reduce((acc, donation) => {
            const method = donation.payment_method || 'other';
            if (!acc[method]) {
                acc[method] = { count: 0, total: 0 };
            }
            acc[method].count++;
            acc[method].total += donation.amount;
            return acc;
        }, {});

        // Calculate total for percentages
        const total = Object.values(stats).reduce((sum, stat) => sum + stat.total, 0);

        // Format for pie chart
        const result = Object.entries(stats).map(([method, data]) => ({
            method,
            name: method.charAt(0).toUpperCase() + method.slice(1),
            total: data.total,
            count: data.count,
            percentage: total > 0 ? ((data.total / total) * 100).toFixed(1) : 0
        }));

        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching payment methods stats:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get time-series donation data
 * @param {number} days - Number of days to look back (7, 30, or 90)
 * @returns {Promise<object>} Time-series data
 */
export const getTimeSeriesData = async (days = 30) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from(TABLES.DONATIONS)
            .select('amount, created_at')
            .eq('status', 'completed')
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: true });

        if (error) throw error;

        // Group by date
        const dailyStats = {};

        // Initialize all days with 0
        for (let i = 0; i < days; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (days - 1 - i));
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dailyStats[dateStr] = { date: dateStr, count: 0, total: 0 };
        }

        // Fill with actual data
        data.forEach(donation => {
            const dateStr = new Date(donation.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (dailyStats[dateStr]) {
                dailyStats[dateStr].count++;
                dailyStats[dateStr].total += donation.amount;
            }
        });

        return { success: true, data: Object.values(dailyStats) };
    } catch (error) {
        console.error('Error fetching time-series data:', error);
        return { success: false, error: error.message };
    }
};
