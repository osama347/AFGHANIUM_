import React, { useEffect, useState } from 'react';
import { useDonation } from '../../hooks/useDonation';
import { getAllEmergencyCampaigns } from '../../supabase/emergencyCampaigns';
import { DollarSign, Users, TrendingUp, Calendar, Clock, AlertTriangle, Building2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Loader from '../Loader';
import StatsCard from './Charts/StatsCard';
import DonationsLineChart from './Charts/DonationsLineChart';
import DepartmentBarChart from './Charts/DepartmentBarChart';
import PaymentMethodsPieChart from './Charts/PaymentMethodsPieChart';


const AdminStats = () => {
    const { getStats, getTimeSeries, getPaymentMethods, loading } = useDonation();
    const [stats, setStats] = useState(null);
    const [timeSeriesData, setTimeSeriesData] = useState([]);
    const [paymentMethodsData, setPaymentMethodsData] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState(30);
    const [error, setError] = useState(null);
    const [emergencyCampaigns, setEmergencyCampaigns] = useState({});

    useEffect(() => {
        fetchAllData();
    }, [selectedPeriod]);

    const fetchAllData = async () => {
        // Fetch stats
        const statsResult = await getStats();
        if (statsResult.success) {
            setStats(statsResult.data);
        } else {
            setError(statsResult.error);
        }

        // Fetch time series
        const timeSeriesResult = await getTimeSeries(selectedPeriod);
        if (timeSeriesResult.success) {
            setTimeSeriesData(timeSeriesResult.data);
        }

        // Fetch payment methods
        const paymentResult = await getPaymentMethods();
        if (paymentResult.success) {
            setPaymentMethodsData(paymentResult.data);
        }

        // Fetch Emergency Campaigns for name resolution
        const campaignsResult = await getAllEmergencyCampaigns();
        if (campaignsResult.success) {
            const campaignMap = {};
            campaignsResult.data.forEach(c => {
                campaignMap[c.id] = c.name_en;
            });
            setEmergencyCampaigns(campaignMap);
        }
    };

    if (loading && !stats) {
        return (
            <div className="flex justify-center py-12">
                <Loader size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                Error loading stats: {error}
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        {
            icon: DollarSign,
            label: 'Total Donations',
            value: formatCurrency(stats.totalAmount || 0),
            color: 'text-green-600',
            bg: 'bg-green-100',
        },
        {
            icon: Users,
            label: 'Total Donors',
            value: stats.totalDonations || 0,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
        },
        {
            icon: Calendar,
            label: 'This Month',
            value: stats.monthlyDonations || 0,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
        },
        {
            icon: Clock,
            label: 'Pending Donations',
            value: stats.pendingDonations || 0,
            color: 'text-orange-600',
            bg: 'bg-orange-100',
        },
    ];

    // Split departments into Emergency vs General
    const emergencyStats = {};
    const generalStats = {};

    Object.entries(stats.byDepartment || {}).forEach(([deptId, data]) => {
        if (emergencyCampaigns[deptId]) {
            emergencyStats[deptId] = { ...data, name: emergencyCampaigns[deptId] };
        } else {
            generalStats[deptId] = data;
        }
    });

    // Format department data for bar chart (Combine both for overview)
    const departmentChartData = [
        ...Object.entries(generalStats).map(([name, data]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            amount: data.amount,
            count: data.count
        })),
        ...Object.entries(emergencyStats).map(([id, data]) => ({
            name: data.name.substring(0, 15) + '...', // Truncate for chart
            amount: data.amount,
            count: data.count
        }))
    ];

    const periodOptions = [
        { value: 7, label: 'Last 7 Days' },
        { value: 30, label: 'Last 30 Days' },
        { value: 90, label: 'Last 90 Days' },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <StatsCard
                        key={index}
                        icon={stat.icon}
                        label={stat.label}
                        value={stat.value}
                        color={stat.color}
                        bg={stat.bg}
                    />
                ))}
            </div>

            {/* Period Selector for Line Chart */}
            <div className="mb-4 flex gap-2">
                {periodOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setSelectedPeriod(option.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedPeriod === option.value
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Line Chart */}
            <div className="mb-8">
                <DonationsLineChart
                    data={timeSeriesData}
                    period={periodOptions.find(p => p.value === selectedPeriod)?.label || '30 days'}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Department Bar Chart */}
                <DepartmentBarChart data={departmentChartData} />

                {/* Payment Methods Pie Chart */}
                <PaymentMethodsPieChart data={paymentMethodsData} />
            </div>

            {/* Department Breakdown Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Emergency Relief Funds */}
                <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                    <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-bold text-red-800">Emergency Relief Funds</h3>
                    </div>
                    <div className="p-6">
                        {Object.keys(emergencyStats).length > 0 ? (
                            <div className="space-y-4">
                                {Object.entries(emergencyStats).map(([id, data]) => (
                                    <div key={id} className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-lg shadow-sm">
                                        <div>
                                            <div className="font-semibold text-gray-900">{data.name}</div>
                                            <div className="text-sm text-gray-600">{data.count} donations</div>
                                        </div>
                                        <div className="text-lg font-bold text-red-600">{formatCurrency(data.amount)}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No emergency donations yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* General Department Funds */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-bold text-gray-800">General Departments</h3>
                    </div>
                    <div className="p-6">
                        {Object.keys(generalStats).length > 0 ? (
                            <div className="space-y-4">
                                {Object.entries(generalStats).map(([dept, data]) => (
                                    <div key={dept} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-semibold text-gray-900 capitalize">{dept}</div>
                                            <div className="text-sm text-gray-600">{data.count} donations</div>
                                        </div>
                                        <div className="text-lg font-bold text-gray-700">{formatCurrency(data.amount)}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No general donations yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
