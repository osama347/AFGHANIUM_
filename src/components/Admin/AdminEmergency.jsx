import React, { useEffect, useState } from 'react';
import { useEmergencyCampaign } from '../../hooks/useEmergencyCampaign';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Plus, Edit2, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import Loader from '../Loader';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../supabase/client';

const AdminEmergency = () => {
    const { getAll, toggleVisibility, remove, create, update, loading } = useEmergencyCampaign();
    const [campaigns, setCampaigns] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null); // Track which campaign is being edited
    const [loadingStates, setLoadingStates] = useState({}); // Track loading for individual campaigns
    const [isCreating, setIsCreating] = useState(false); // Track creating state
    const { showToast } = useToast();

    useEffect(() => {
        // Initial fetch of campaigns
        fetchCampaigns();
        // No real-time subscription here; UI will refresh after each action
    }, []);

    const fetchCampaigns = async () => {
        console.log('Fetching campaigns directly from component...');
        try {
            const { data, error } = await supabase
                .from('emergency_campaigns')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log('Direct fetch success:', data);
            setCampaigns(data || []);
        } catch (error) {
            console.error('Direct fetch error:', error);
            showToast('Failed to load campaigns: ' + error.message, 'error');
        }
    };

    const handleToggleVisibility = async (id, currentStatus) => {
        // Set loading state for this specific button
        setLoadingStates(prev => ({ ...prev, [`toggle_${id}`]: true }));

        // Optimistically update UI immediately
        setCampaigns(prev =>
            prev.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c)
        );

        // Then call API
        const result = await toggleVisibility(id, !currentStatus);

        // Remove loading state
        setLoadingStates(prev => ({ ...prev, [`toggle_${id}`]: false }));

        if (result.success) {
            // Update with actual data from server to ensure consistency
            if (result.data) {
                setCampaigns(prev =>
                    prev.map(c => c.id === id ? { ...c, is_active: result.data.is_active } : c)
                );
            }
            showToast(
                !currentStatus ? 'Campaign now showing on homepage!' : 'Campaign hidden from homepage',
                'success'
            );
        } else {
            // Revert on failure
            setCampaigns(prev =>
                prev.map(c => c.id === id ? { ...c, is_active: currentStatus } : c)
            );
            showToast('Failed to update campaign visibility', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this campaign?')) return;

        // Set loading state
        setLoadingStates(prev => ({ ...prev, [`delete_${id}`]: true }));

        // Store the campaign before deleting for potential rollback
        const deletedCampaign = campaigns.find(c => c.id === id);

        // Optimistically remove from UI
        setCampaigns(prev => prev.filter(c => c.id !== id));

        // Then call API
        const result = await remove(id);

        // Remove loading state
        setLoadingStates(prev => ({ ...prev, [`delete_${id}`]: false }));

        if (result.success) {
            showToast('Campaign deleted successfully', 'success');
        } else {
            // Revert on failure
            if (deletedCampaign) {
                setCampaigns(prev => [...prev, deletedCampaign]);
            }
            showToast('Failed to delete campaign', 'error');
        }
    };
    //   setShowForm(false);
    //   fetchCampaigns();


    if (loading && campaigns.length === 0) {
        return (
            <div className="flex justify-center py-12">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Emergency Campaigns</h1>
                    <p className="text-gray-600">Manage urgent relief campaigns shown on homepage</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCampaign(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    New Campaign
                </button>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => {
                    const percentage = campaign.progress_percentage || 0;
                    const isExpired = campaign.urgent_until && new Date(campaign.urgent_until) < new Date();

                    return (
                        <div
                            key={campaign.id}
                            className={`relative overflow-hidden bg-white rounded-xl shadow-lg border-2 p-6 transition-all hover:shadow-xl flex flex-col ${campaign.is_active ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'} ${isExpired ? 'opacity-60' : ''}`}
                        >
                            {/* Campaign Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">{campaign.icon}</span>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">{campaign.name_en}</h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {campaign.is_active && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full shadow-sm">
                                                <Eye className="w-3 h-3" />
                                                LIVE
                                            </span>
                                        )}
                                        {isExpired && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-sm">
                                                <AlertTriangle className="w-3 h-3" />
                                                EXPIRED
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-4 min-h-[3rem]">{campaign.description_en}</p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-left">
                                    <p className="text-xs text-gray-500 mb-1">Goal</p>
                                    <p className="text-lg font-bold text-gray-900 leading-tight">{formatCurrency(campaign.goal_amount)}</p>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-gray-500 mb-1">Raised</p>
                                    <p className="text-lg font-bold text-green-600 leading-tight">{formatCurrency(campaign.current_amount || 0)}</p>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-gray-500 mb-1">Progress</p>
                                    <p className="text-lg font-bold text-primary leading-tight">{Math.round(percentage)}%</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                >
                                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 mb-4 leading-tight">
                                {campaign.donation_count || 0} donations
                                {campaign.urgent_until && ` · Expires: ${formatDateTime(campaign.urgent_until)}`}
                            </p>

                            {/* Action Buttons at Bottom */}
                            <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t">
                                <button
                                    onClick={() => handleToggleVisibility(campaign.id, campaign.is_active)}
                                    disabled={loadingStates[`toggle_${campaign.id}`]}
                                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md ${campaign.is_active
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700'
                                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                        } ${loadingStates[`toggle_${campaign.id}`] ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    title={campaign.is_active ? 'Hide from homepage' : 'Show on homepage'}
                                >
                                    {loadingStates[`toggle_${campaign.id}`] ? (
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : campaign.is_active ? (
                                        <>
                                            <EyeOff className="w-4 h-4" />
                                            <span className="hidden sm:inline">Hide</span>
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-4 h-4" />
                                            <span className="hidden sm:inline">Show</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => setEditingCampaign(campaign)}
                                    className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold text-sm transition-all shadow-sm hover:shadow-md"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Edit</span>
                                </button>

                                <button
                                    onClick={() => handleDelete(campaign.id)}
                                    disabled={loadingStates[`delete_${campaign.id}`]}
                                    className={`flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-semibold text-sm transition-all shadow-sm hover:shadow-md ${loadingStates[`delete_${campaign.id}`] ? 'opacity-75 cursor-not-allowed' : ''}`}
                                >
                                    {loadingStates[`delete_${campaign.id}`] ? (
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            <span className="hidden sm:inline">Delete</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}

                {campaigns.length === 0 && (
                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                            <AlertTriangle className="w-10 h-10 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Emergency Campaigns Yet</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">Create your first emergency relief campaign to help those in urgent need</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <Plus className="w-5 h-5" />
                            Create Your First Campaign
                        </button>
                    </div>
                )}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">Create Emergency Campaign</h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    Fields marked with * are required. Campaign will be hidden by default.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setIsCreating(true);

                                const formData = new FormData(e.target);

                                // Extract data carefully
                                const campaignData = {
                                    name_en: formData.get('name_en'),
                                    name_dari: formData.get('name_dari'),
                                    name_pashto: formData.get('name_pashto'),
                                    description_en: formData.get('description_en'),
                                    description_dari: formData.get('description_dari'),
                                    description_pashto: formData.get('description_pashto'),
                                    impact_message_en: formData.get('impact_message_en'),
                                    impact_message_dari: formData.get('impact_message_dari'),
                                    impact_message_pashto: formData.get('impact_message_pashto'),
                                    icon: formData.get('icon'),
                                    goal_amount: parseFloat(formData.get('goal_amount')) || 0,
                                    urgent_until: formData.get('urgent_until') ? formData.get('urgent_until') : null,
                                    priority: parseInt(formData.get('priority')) || 1,
                                    is_active: false,
                                };

                                console.log('Submitting campaign data:', campaignData);

                                try {
                                    // Direct Supabase Insert (Proven to work)
                                    const { data, error } = await supabase
                                        .from('emergency_campaigns')
                                        .insert([campaignData])
                                        .select()
                                        .single();

                                    if (error) throw error;

                                    console.log('Campaign created successfully:', data);
                                    showToast('Success! Reloading page...', 'success');

                                    // Close form immediately
                                    setShowForm(false);

                                    // Force reload quickly
                                    setTimeout(() => {
                                        console.log('Reloading now...');
                                        window.location.reload();
                                    }, 500);
                                } catch (error) {
                                    console.error('Creation failed:', error);
                                    showToast('Failed to create campaign: ' + error.message, 'error');
                                } finally {
                                    setIsCreating(false);
                                }
                            }}
                            className="space-y-6"
                        >
                            {/* Campaign Names */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Campaign Name (English) *
                                    </label>
                                    <input
                                        type="text"
                                        name="name_en"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="e.g. Herat Earthquake Relief"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Campaign Name (Dari)
                                    </label>
                                    <input
                                        type="text"
                                        name="name_dari"
                                        dir="rtl"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="نام کمپین"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Campaign Name (Pashto)
                                    </label>
                                    <input
                                        type="text"
                                        name="name_pashto"
                                        dir="rtl"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="د کمپاین نوم"
                                    />
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description (English) *
                                    </label>
                                    <textarea
                                        name="description_en"
                                        required
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Emergency aid for families affected by..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description (Dari)
                                    </label>
                                    <textarea
                                        name="description_dari"
                                        rows="3"
                                        dir="rtl"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="توضیحات"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description (Pashto)
                                    </label>
                                    <textarea
                                        name="description_pashto"
                                        rows="3"
                                        dir="rtl"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="توضیحات"
                                    />
                                </div>
                            </div>

                            {/* Impact Messages */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Impact Message (English)
                                    </label>
                                    <input
                                        type="text"
                                        name="impact_message_en"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Your $50 provides emergency shelter..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Impact Message (Dari)
                                    </label>
                                    <input
                                        type="text"
                                        name="impact_message_dari"
                                        dir="rtl"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="پیام تاثیر"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Impact Message (Pashto)
                                    </label>
                                    <input
                                        type="text"
                                        name="impact_message_pashto"
                                        dir="rtl"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="د اغیزې پیغام"
                                    />
                                </div>
                            </div>

                            {/* Icon, Goal, Date, Priority */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Icon (Emoji) *
                                    </label>
                                    <input
                                        type="text"
                                        name="icon"
                                        required
                                        maxLength="2"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-2xl text-center"
                                        placeholder="🏚️"
                                        defaultValue="🚨"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">e.g. 🏚️ 🌊 ❄️</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Goal Amount ($) *
                                    </label>
                                    <input
                                        type="number"
                                        name="goal_amount"
                                        required
                                        min="1"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="100000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Expires On (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        name="urgent_until"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Priority (1=High)
                                    </label>
                                    <input
                                        type="number"
                                        name="priority"
                                        min="1"
                                        defaultValue="1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 justify-end pt-6 border-t mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className={`px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${isCreating ? 'opacity-75 cursor-not-allowed' : ''}`}
                                >
                                    {isCreating ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating...
                                        </span>
                                    ) : (
                                        'Create Campaign'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Campaign Modal */}
            {editingCampaign && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Edit Campaign</h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    Update campaign details. Changes are saved immediately.
                                </p>
                            </div>
                            <button
                                onClick={() => setEditingCampaign(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setIsCreating(true);

                                const formData = new FormData(e.target);
                                const updates = {
                                    name_en: formData.get('name_en'),
                                    name_dari: formData.get('name_dari'),
                                    name_pashto: formData.get('name_pashto'),
                                    description_en: formData.get('description_en'),
                                    description_dari: formData.get('description_dari'),
                                    description_pashto: formData.get('description_pashto'),
                                    impact_message_en: formData.get('impact_message_en'),
                                    impact_message_dari: formData.get('impact_message_dari'),
                                    impact_message_pashto: formData.get('impact_message_pashto'),
                                    icon: formData.get('icon'),
                                    goal_amount: parseFloat(formData.get('goal_amount')),
                                    urgent_until: formData.get('urgent_until') || null,
                                    priority: parseInt(formData.get('priority')) || 1,
                                };

                                // Optimistic update
                                setCampaigns(prev =>
                                    prev.map(c => c.id === editingCampaign.id ? { ...c, ...updates } : c)
                                );

                                const result = await update(editingCampaign.id, updates);
                                setIsCreating(false);
                                setEditingCampaign(null);

                                if (result.success) {
                                    showToast('Campaign updated successfully!', 'success');
                                    // Update with real data from server without full refresh
                                    if (result.data) {
                                        setCampaigns(prev =>
                                            prev.map(c => c.id === result.data.id ? result.data : c)
                                        );
                                    }
                                } else {
                                    showToast('Failed to update campaign', 'error');
                                    // Revert on failure
                                    setCampaigns(prev =>
                                        prev.map(c => c.id === editingCampaign.id ? editingCampaign : c)
                                    );
                                }
                            }}
                            className="space-y-6"
                        >
                            {/* Same form fields as create, but with defaultValue from editingCampaign */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign Name (English) *</label>
                                    <input type="text" name="name_en" required defaultValue={editingCampaign.name_en}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign Name (Dari)</label>
                                    <input type="text" name="name_dari" dir="rtl" defaultValue={editingCampaign.name_dari}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign Name (Pashto)</label>
                                    <input type="text" name="name_pashto" dir="rtl" defaultValue={editingCampaign.name_pashto}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description (English) *</label>
                                    <textarea name="description_en" required rows="3" defaultValue={editingCampaign.description_en}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Dari)</label>
                                    <textarea name="description_dari" rows="3" dir="rtl" defaultValue={editingCampaign.description_dari}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Pashto)</label>
                                    <textarea name="description_pashto" rows="3" dir="rtl" defaultValue={editingCampaign.description_pashto}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Icon *</label>
                                    <input type="text" name="icon" required maxLength="2" defaultValue={editingCampaign.icon}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl text-center" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Amount ($) *</label>
                                    <input type="number" name="goal_amount" required min="1" step="0.01" defaultValue={editingCampaign.goal_amount}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expires On</label>
                                    <input type="date" name="urgent_until" defaultValue={editingCampaign.urgent_until?.split('T')[0]}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                                    <input type="number" name="priority" min="1" defaultValue={editingCampaign.priority}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end pt-6 border-t mt-8">
                                <button type="button" onClick={() => setEditingCampaign(null)}
                                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isCreating}
                                    className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${isCreating ? 'opacity-75 cursor-not-allowed' : ''}`}>
                                    {isCreating ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEmergency;
