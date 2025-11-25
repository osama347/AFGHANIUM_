import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { Trophy, Medal, Award } from 'lucide-react';

const TopDonors = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopDonors();
    }, []);

    const fetchTopDonors = async () => {
        try {
            const { data, error } = await supabase
                .from('donations')
                .select('full_name, amount, created_at')
                .neq('status', 'failed')
                .neq('status', 'cancelled')
                .order('amount', { ascending: false })
                .limit(3);

            if (error) throw error;
            setDonors(data || []);
        } catch (error) {
            console.error('Error fetching top donors:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMedal = (index) => {
        switch (index) {
            case 0: return <Trophy className="w-8 h-8 text-yellow-400" />;
            case 1: return <Medal className="w-8 h-8 text-gray-400" />;
            case 2: return <Award className="w-8 h-8 text-orange-400" />;
            default: return null;
        }
    };

    const getRankColor = (index) => {
        switch (index) {
            case 0: return 'bg-yellow-50 border-yellow-200';
            case 1: return 'bg-gray-50 border-gray-200';
            case 2: return 'bg-orange-50 border-orange-200';
            default: return 'bg-white';
        }
    };

    if (loading || donors.length === 0) return null;

    return (
        <section className="section-padding bg-white">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our Top Supporters 🏆
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We are deeply grateful to our most generous contributors who are leading the way in making a difference.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {donors.map((donor, index) => (
                        <div
                            key={index}
                            className={`${getRankColor(index)} border-2 rounded-2xl p-8 text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-lg relative overflow-hidden`}
                        >
                            {/* Rank Badge */}
                            <div className="absolute top-4 right-4">
                                <span className="text-4xl font-black opacity-10">#{index + 1}</span>
                            </div>

                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="bg-white p-4 rounded-full shadow-md">
                                    {getMedal(index)}
                                </div>
                            </div>

                            {/* Name */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {donor.full_name}
                            </h3>

                            {/* Amount */}
                            <div className="text-3xl font-bold text-primary mb-4">
                                ${donor.amount.toLocaleString()}
                            </div>

                            {/* Date */}
                            <p className="text-sm text-gray-500">
                                Donated on {new Date(donor.created_at).toLocaleDateString()}
                            </p>

                            {index === 0 && (
                                <div className="mt-4 inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Gold Donor
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopDonors;
