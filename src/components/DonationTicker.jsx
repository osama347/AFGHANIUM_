import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { Heart } from 'lucide-react';

const DonationTicker = () => {
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        fetchRecentDonations();

        // Subscribe to real-time updates
        const subscription = supabase
            .channel('donations-ticker')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, () => {
                fetchRecentDonations();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchRecentDonations = async () => {
        const { data, error } = await supabase
            .from('donations')
            .select('full_name, amount, department, created_at')
            .neq('status', 'failed')
            .neq('status', 'cancelled')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching donations:', error);
        }

        if (data) {
            setDonations(data);
        }
    };

    const getVariedMessage = (donation, index) => {
        const messages = [
            `${donation.full_name} donated $${donation.amount} 💚`,
            `${donation.full_name} just contributed $${donation.amount} to ${donation.department}`,
            `$${donation.amount} from ${donation.full_name} - Thank you!`,
            `${donation.full_name} supported ${donation.department} with $${donation.amount}`,
            `Amazing! ${donation.full_name} donated $${donation.amount}`,
            `${donation.full_name} made a difference with $${donation.amount}`,
        ];
        return messages[index % messages.length];
    };

    if (donations.length === 0) return null;

    // Duplicate donations for seamless loop
    const tickerItems = [...donations, ...donations];

    return (
        <div className="bg-accent-gold text-white py-3 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-gold via-yellow-600 to-accent-gold opacity-20"></div>
            <div className="ticker-container">
                <div className="ticker-content inline-flex">
                    {tickerItems.map((donation, index) => (
                        <span key={`${donation.full_name}-${donation.created_at}-${index}`} className="ticker-item flex items-center">
                            <Heart className="w-4 h-4 mr-2 fill-current" />
                            <span>{getVariedMessage(donation, index)}</span>
                            <span className="mx-6">•</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DonationTicker;
