import React, { useEffect, useState } from 'react';
import { DollarSign, Heart, TrendingUp, Users } from 'lucide-react';
import { supabase } from '../supabase/client';

const StatsSection = () => {
    const [stats, setStats] = useState({
        totalRaised: 0,
        totalDonations: 0,
        livesImpacted: 0,
        activeProjects: 0,
    });

    async function fetchStats() {
        try {
            // Get total amount raised from valid donations (completed + pending)
            const { data: validDonations, error: donationsError } = await supabase
                .from('donations')
                .select('amount')
                .neq('status', 'failed')
                .neq('status', 'cancelled');

            if (donationsError) {
                console.error('Error fetching donations:', donationsError);
            }

            const totalRaised = validDonations?.reduce((sum, d) => {
                const amount = parseFloat(d.amount) || 0;
                return sum + amount;
            }, 0) || 0;

            // Get total donation count
            const { count: donationCount, error: countError } = await supabase
                .from('donations')
                .select('*', { count: 'exact', head: true })
                .neq('status', 'failed')
                .neq('status', 'cancelled');

            if (countError) {
                console.error('Error counting donations:', countError);
            }

            // Get total impact proofs (lives impacted)
            const { count: impactCount, error: impactError } = await supabase
                .from('impacts')
                .select('*', { count: 'exact', head: true });

            if (impactError) {
                console.error('Error counting impacts:', impactError);
            }

            console.log('Stats loaded:', {
                totalRaised,
                donationCount,
                impactCount,
                impacts: impactCount
            });

            setStats({
                totalRaised: Math.round(totalRaised),
                totalDonations: donationCount || 0,
                livesImpacted: Math.floor(totalRaised / 20), // Estimate: $20 helps 1 person
                activeProjects: impactCount || 6,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Set default values on error
            setStats({
                totalRaised: 0,
                totalDonations: 0,
                livesImpacted: 0,
                activeProjects: 6,
            });
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStats();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const statCards = [
        {
            icon: DollarSign,
            value: stats.totalRaised,
            label: 'Total Raised',
            prefix: '$',
        },
        {
            icon: Heart,
            value: stats.totalDonations,
            label: 'Total Donations',
            suffix: '+',
        },
        {
            icon: Users,
            value: stats.livesImpacted,
            label: 'Lives Impacted',
            suffix: '+',
        },
        {
            icon: TrendingUp,
            value: stats.activeProjects,
            label: 'Active Projects',
        },
    ];

    const formatStatValue = (value) => value.toLocaleString();

    return (
        <section className="section-padding relative overflow-hidden bg-gradient-to-br from-primary-dark to-primary">
            <div className="afghan-pattern-bg absolute inset-0 opacity-10" />
            <div className="container-custom relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-white/10 bg-white/8 backdrop-blur-sm p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/12"
                        >
                            <div className="w-14 h-14 rounded-xl bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center mx-auto mb-5">
                                <stat.icon className="w-7 h-7 text-accent-gold" />
                            </div>
                            <div className="text-white">
                                <div className="font-display text-4xl md:text-5xl font-bold">
                                    {stat.prefix || ''}{formatStatValue(stat.value)}{stat.suffix || ''}
                                </div>
                            </div>
                            <p className="text-white/70 mt-2 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
