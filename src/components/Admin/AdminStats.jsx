import React, { useEffect, useState } from 'react';
import { useDonation } from '../../hooks/useDonation';
import { DollarSign, Users, TrendingUp, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Loader from '../Loader';
import StatsCard from './Charts/StatsCard';
import DonationsLineChart from './Charts/DonationsLineChart';
import PaymentMethodsPieChart from './Charts/PaymentMethodsPieChart';


const AdminStats = () => {
    const { getDashboardData } = useDonation();
    const [stats, setStats] = useState(null);
    const [timeSeriesData, setTimeSeriesData] = useState([]);
    const [paymentMethodsData, setPaymentMethodsData] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState(30);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchDashboardData() {
        setLoading(true);
        const result = await getDashboardData(selectedPeriod);

        if (!result.success) {
            setError(result.error);
            setLoading(false);
            return;
        }

        setStats(result.data.stats);
        setTimeSeriesData(result.data.timeSeries);
        setPaymentMethodsData(result.data.paymentMethods);
        setLoading(false);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDashboardData();
        }, 0);

        return () => clearTimeout(timer);
    }, [selectedPeriod]);

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
            <div className="grid grid-cols-1 gap-6 mb-8">
                {/* Payment Methods Pie Chart */}
                <PaymentMethodsPieChart data={paymentMethodsData} />
            </div>
        </div>
    );
};

export default AdminStats;
