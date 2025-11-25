import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useEmergencyCampaign } from '../hooks/useEmergencyCampaign';
import { supabase } from '../supabase/client';
import { formatCurrency } from '../utils/formatters';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import UrgentBadge from './UrgentBadge';
import Loader from './Loader';

const EmergencyDepartments = () => {
    const { currentLanguage } = useLanguage();
    const { getActive, loading } = useEmergencyCampaign();
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        fetchActiveCampaigns();

        // Set up real-time subscription for campaign changes
        const subscription = supabase
            .channel('emergency_campaigns_changes')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'emergency_campaigns'
                },
                (payload) => {
                    console.log('Emergency campaign changed:', payload);
                    // Refresh campaigns when any change occurs
                    fetchActiveCampaigns();
                }
            )
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchActiveCampaigns = async () => {
        const result = await getActive();
        if (result.success) {
            // Filter out expired campaigns
            const activeCampaigns = result.data.filter(campaign => {
                if (!campaign.urgent_until) return true;
                return new Date(campaign.urgent_until) > new Date();
            });
            setCampaigns(activeCampaigns);
        }
    };

    // Don't render if no active campaigns
    if (loading) {
        return (
            <div className="section-padding flex justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    if (campaigns.length === 0) return null;

    return (
        <section className="section-padding urgent-gradient">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-10 h-10 text-red-600 animate-pulse" />
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            🚨 EMERGENCY RELIEF
                        </h2>
                        <AlertTriangle className="w-10 h-10 text-red-600 animate-pulse" />
                    </div>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Your immediate support can save lives. Help families in crisis right now.
                    </p>
                </div>

                {/* Emergency Cards Grid - Responsive based on count */}
                <div className={`grid gap-8 ${campaigns.length === 1
                    ? 'grid-cols-1 max-w-2xl mx-auto'
                    : campaigns.length === 2
                        ? 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto'
                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    }`}>
                    {campaigns.map((campaign) => {
                        const percentage = campaign.progress_percentage || 0;
                        const quickAmounts = campaign.quick_amounts || [25, 50, 100, 250];

                        return (
                            <div
                                key={campaign.id}
                                className="bg-white rounded-2xl shadow-xl border-2 border-red-500 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl urgent-card flex flex-col h-full"
                            >
                                {/* Card Header with Badge */}
                                <div className="relative bg-gradient-to-r from-red-600 to-red-500 p-6 text-white">
                                    <UrgentBadge className="absolute top-4 right-4" showIcon />
                                    <div className="text-5xl mb-3">{campaign.icon || '🚨'}</div>
                                    <h3 className="text-2xl font-bold mb-2">
                                        {campaign[`name_${currentLanguage}`] || campaign.name_en}
                                    </h3>
                                    <p className="text-red-100 text-sm">
                                        {campaign[`description_${currentLanguage}`] || campaign.description_en}
                                    </p>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 flex flex-col flex-1">
                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                                            <span className="font-semibold text-gray-700">Raised</span>
                                            <span className="font-bold text-red-600 text-right">
                                                {formatCurrency(campaign.current_amount || 0)} / {formatCurrency(campaign.goal_amount)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-red-600 to-red-500 h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                            <span className="text-gray-600">{campaign.donation_count || 0} donations</span>
                                            <span className="font-bold text-red-600 text-right">{Math.round(percentage)}% Funded</span>
                                        </div>
                                    </div>

                                    {/* Impact Message */}
                                    {campaign.impact_message_en && (
                                        <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded">
                                            <p className="text-sm text-gray-800 font-medium">
                                                💝 {campaign[`impact_message_${currentLanguage}`] || campaign.impact_message_en}
                                            </p>
                                        </div>
                                    )}

                                    {/* Quick Donate Buttons */}
                                    <div className="mb-4 mt-auto">
                                        <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">Quick Donate</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {quickAmounts.map(amount => (
                                                <Link
                                                    key={amount}
                                                    to={`/donate?emergency=${campaign.id}&amount=${amount}`}
                                                    className="text-center px-3 py-2 bg-red-100 border-2 border-red-500 text-red-700 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 text-sm"
                                                >
                                                    ${amount}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Main CTA */}
                                    <Link
                                        to={`/donate?emergency=${campaign.id}`}
                                        className="block w-full text-center px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        DONATE NOW →
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default EmergencyDepartments;
