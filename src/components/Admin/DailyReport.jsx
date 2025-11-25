import React, { useEffect, useState } from 'react';
import { useDonation } from '../../hooks/useDonation';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { BarChart3, Calendar } from 'lucide-react';
import Loader from '../Loader';

const DailyReport = () => {
    const { getDailyStats, loading } = useDonation();
    const [dailyData, setDailyData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDailyStats();
    }, []);

    const fetchDailyStats = async () => {
        const result = await getDailyStats();
        if (result.success) {
            setDailyData(result.data);
        } else {
            setError(result.error);
        }
    };

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                Error loading daily report: {error}
            </div>
        );
    }

    // Calculate total donations to check if we should show the empty state
    const totalDonations = dailyData ? dailyData.reduce((sum, day) => sum + day.count, 0) : 0;

    if (!dailyData || dailyData.length === 0 || totalDonations === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No daily data available</h3>
                <p className="text-gray-500">Donations will appear here day by day.</p>
            </div>
        );
    }

    // Find max amount for scaling bars
    const maxAmount = Math.max(...dailyData.map(d => d.amount));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Everyday Report
                </h3>
                <span className="text-sm text-gray-500">Last 30 Days</span>
            </div>

            <div className="p-6">
                <div className="space-y-4">
                    {dailyData.map((day) => (
                        <div key={day.date} className="group">
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">{formatDateTime(day.date).split(',')[0]}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500">{day.count} donations</span>
                                    <span className="font-bold text-gray-900">{formatCurrency(day.amount)}</span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out group-hover:bg-primary-dark"
                                    style={{ width: `${(day.amount / maxAmount) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DailyReport;
