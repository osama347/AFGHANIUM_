import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDonation } from '../../hooks/useDonation';
import { getAllEmergencyCampaigns } from '../../supabase/emergencyCampaigns';
import { updateDonationStatus } from '../../supabase/donations';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { DollarSign, Plus, Download, Search, AlertTriangle } from 'lucide-react';
import Loader from '../Loader';
import { exportToCSV } from '../../utils/export';

const DonationsList = () => {
    const navigate = useNavigate();
    const { getAll, loading } = useDonation();
    const [donations, setDonations] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [emergencyCampaigns, setEmergencyCampaigns] = useState({});

    useEffect(() => {
        fetchDonations();
        fetchEmergencyCampaigns();
    }, []);

    const fetchDonations = async () => {
        const result = await getAll();
        if (result.success) {
            setDonations(result.data);
        } else {
            setError(result.error);
        }
    };

    const fetchEmergencyCampaigns = async () => {
        const result = await getAllEmergencyCampaigns();
        if (result.success) {
            const campaignMap = {};
            result.data.forEach(c => {
                campaignMap[c.id] = c.name_en;
            });
            setEmergencyCampaigns(campaignMap);
        }
    };

    const handleApproveDonation = async (donationId) => {
        if (window.confirm('Are you sure you want to approve this donation? This will mark it as completed.')) {
            const result = await updateDonationStatus(donationId, 'completed');
            if (result.success) {
                // Refresh the donations list
                fetchDonations();
                alert('Donation approved successfully!');
            } else {
                alert('Failed to approve donation: ' + result.error);
            }
        }
    };

    const handleRejectDonation = async (donationId) => {
        const reason = prompt('Please provide a reason for rejecting this donation (optional):');
        if (reason !== null) { // User didn't cancel
            const result = await updateDonationStatus(donationId, 'failed');
            if (result.success) {
                // Refresh the donations list
                fetchDonations();
                alert('Donation rejected successfully!');
            } else {
                alert('Failed to reject donation: ' + result.error);
            }
        }
    };

    const handleCancelDonation = async (donationId) => {
        if (window.confirm('Are you sure you want to cancel this donation? This action cannot be undone.')) {
            const result = await updateDonationStatus(donationId, 'cancelled');
            if (result.success) {
                // Refresh the donations list
                fetchDonations();
                alert('Donation cancelled successfully!');
            } else {
                alert('Failed to cancel donation: ' + result.error);
            }
        }
    };

    const getDepartmentLabel = (deptId) => {
        if (emergencyCampaigns[deptId]) {
            return (
                <span className="flex items-center gap-1 text-red-600 font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    {emergencyCampaigns[deptId]}
                </span>
            );
        }
        return <span className="capitalize">{deptId}</span>;
    };

    const handleExport = () => {
        if (donations.length > 0) {
            // Format data for export
            const exportData = donations.map(d => ({
                ID: d.donation_id,
                Donor: d.full_name,
                Email: d.email,
                Amount: d.amount,
                Department: emergencyCampaigns[d.department] || d.department,
                Payment_Method: d.payment_method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                Transaction_Reference: d.transaction_reference || '',
                Status: d.status,
                Date: new Date(d.created_at).toLocaleDateString(),
                Time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            exportToCSV(exportData, `donations-${new Date().toISOString().split('T')[0]}.csv`);
        }
    };

    // Filter and Group Donations
    const groupedDonations = useMemo(() => {
        // 1. Filter
        const filtered = donations.filter(d => {
            // Status filter
            if (statusFilter !== 'all' && d.status !== statusFilter) {
                return false;
            }

            // Search filter
            const searchLower = searchTerm.toLowerCase();
            const deptName = emergencyCampaigns[d.department] ? emergencyCampaigns[d.department].toLowerCase() : d.department.toLowerCase();
            return (
                d.full_name.toLowerCase().includes(searchLower) ||
                d.donation_id.toLowerCase().includes(searchLower) ||
                deptName.includes(searchLower)
            );
        });

        // 2. Group by Date
        const groups = {};
        filtered.forEach(d => {
            const date = new Date(d.created_at).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(d);
        });

        return groups;
    }, [donations, searchTerm, statusFilter, emergencyCampaigns]);

    // Calculate donation statistics
    const donationStats = useMemo(() => {
        const stats = {
            total: donations.length,
            pending: 0,
            completed: 0,
            failed: 0,
            cancelled: 0,
            pendingManual: 0, // Manual payments waiting for approval
        };

        donations.forEach(d => {
            stats[d.status] = (stats[d.status] || 0) + 1;

            // Count manual payments that need approval
            if (d.status === 'pending' &&
                (d.payment_method === 'hawala' || d.payment_method === 'western_union' ||
                 d.payment_method === 'bank_transfer' || d.payment_method === 'moneygram') &&
                d.transaction_reference) {
                stats.pendingManual++;
            }
        });

        return stats;
    }, [donations]);

    if (loading) {
        return <Loader size="lg" />;
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
                Error loading donations: {error}
            </div>
        );
    }

    return (
        <div>
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div className="text-2xl font-bold text-gray-900">{donationStats.total}</div>
                    <div className="text-sm text-gray-500">Total Donations</div>
                </div>
                <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
                    <div className="text-2xl font-bold text-yellow-700">{donationStats.pending}</div>
                    <div className="text-sm text-yellow-600">Pending</div>
                </div>
                <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
                    <div className="text-2xl font-bold text-blue-700">{donationStats.pendingManual}</div>
                    <div className="text-sm text-blue-600">Need Approval</div>
                </div>
                <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
                    <div className="text-2xl font-bold text-green-700">{donationStats.completed}</div>
                    <div className="text-sm text-green-600">Completed</div>
                </div>
                <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4">
                    <div className="text-2xl font-bold text-red-700">{donationStats.failed + donationStats.cancelled}</div>
                    <div className="text-sm text-red-600">Rejected</div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold text-gray-900">All Donations</h2>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-48 appearance-none bg-white"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by Name, ID, or Department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
                        />
                    </div>

                    <button
                        onClick={handleExport}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {Object.keys(groupedDonations).length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <DollarSign className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No donations found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or wait for new donations.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedDonations).map(([date, groupDonations]) => (
                        <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    {date}
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-white">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Donor</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction Ref</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Method</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {groupDonations.map((donation) => (
                                            <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {donation.donation_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="font-medium">{donation.full_name}</div>
                                                    <div className="text-gray-500 text-xs">{donation.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">
                                                    {formatCurrency(donation.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {getDepartmentLabel(donation.department)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {donation.transaction_reference || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {donation.payment_method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(donation.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    {donation.status === 'pending' && (
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleApproveDonation(donation.donation_id)}
                                                                className="text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                                                title="Approve this donation"
                                                            >
                                                                ✓ Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectDonation(donation.donation_id)}
                                                                className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                                                title="Reject this donation"
                                                            >
                                                                ✗ Reject
                                                            </button>
                                                        </div>
                                                    )}

                                                    {donation.status === 'completed' && (
                                                        <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded">
                                                            ✓ Completed
                                                        </span>
                                                    )}

                                                    {donation.status === 'failed' && (
                                                        <span className="text-red-600 text-xs bg-red-50 px-2 py-1 rounded">
                                                            ✗ Failed
                                                        </span>
                                                    )}

                                                    {donation.status === 'cancelled' && (
                                                        <span className="text-gray-600 text-xs bg-gray-50 px-2 py-1 rounded">
                                                            Cancelled
                                                        </span>
                                                    )}

                                                    {/* Add Impact Proof button - available for all completed donations */}
                                                    {donation.status === 'completed' && (
                                                        <button
                                                            onClick={() => navigate(`/admin/impacts?donationId=${donation.donation_id}&donorName=${encodeURIComponent(donation.full_name)}&department=${donation.department}&amount=${donation.amount}`)}
                                                            className="text-primary hover:text-primary-dark flex items-center gap-1 ml-2 transition-colors"
                                                            title="Add Impact Proof"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            Add Proof
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DonationsList;
