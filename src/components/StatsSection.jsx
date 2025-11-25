import React, { useEffect, useState } from 'react';
import { DollarSign, Heart, TrendingUp, Users } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import { supabase } from '../supabase/client';

const StatsSection = () => {
    const [stats, setStats] = useState({
        totalRaised: 0,
        totalDonations: 0,
        livesImpacted: 0,
        activeProjects: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
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

            // Get unique departments (active projects)
            const { data: departments, error: deptError } = await supabase
                .from('donations')
                .select('department')
                .neq('status', 'failed')
                .neq('status', 'cancelled');

            if (deptError) {
                console.error('Error fetching departments:', deptError);
            }

            const uniqueDepartments = new Set(departments?.map(d => d.department).filter(Boolean) || []);

            console.log('Stats loaded:', {
                totalRaised,
                donationCount,
                impactCount,
                departments: uniqueDepartments.size
            });

            setStats({
                totalRaised: Math.round(totalRaised),
                totalDonations: donationCount || 0,
                livesImpacted: Math.floor(totalRaised / 20), // Estimate: $20 helps 1 person
                activeProjects: uniqueDepartments.size || 6, // Default to 6 if no data
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
    };

    const statCards = [
        {
            icon: DollarSign,
            value: stats.totalRaised,
            label: 'Total Raised',
            prefix: '$',
            color: 'bg-green-500',
        },
        {
            icon: Heart,
            value: stats.totalDonations,
            label: 'Total Donations',
            suffix: '+',
            color: 'bg-red-500',
        },
        {
            icon: Users,
            value: stats.livesImpacted,
            label: 'Lives Impacted',
            suffix: '+',
            color: 'bg-blue-500',
        },
        {
            icon: TrendingUp,
            value: stats.activeProjects,
            label: 'Active Projects',
            color: 'bg-purple-500',
        },
    ];

    return (
        <section className="section-padding bg-gradient-to-br from-primary-dark to-primary">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center transform hover:scale-105 transition-transform duration-300"
                        >
                            <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <stat.icon className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-white">
                                <AnimatedCounter
                                    end={stat.value}
                                    prefix={stat.prefix}
                                    suffix={stat.suffix}
                                />
                            </div>
                            <p className="text-gray-200 mt-2 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
