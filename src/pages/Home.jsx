import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Departments from '../components/Departments';
import SectionTitle from '../components/SectionTitle';
import StatsSection from '../components/StatsSection';
import DonationTicker from '../components/DonationTicker';
import EmergencyDepartments from '../components/EmergencyDepartments';
import { useLanguage } from '../contexts/LanguageContext';
import { useDonation } from '../hooks/useDonation';
import { useImpact } from '../hooks/useImpact';
import { formatCurrency } from '../utils/formatters';
import { Home as HomeIcon, Heart, Users, TrendingUp } from 'lucide-react';
import CTAButton from '../components/CTAButton';
import TestimonialCard from '../components/TestimonialCard';

const Home = () => {
    const { t } = useLanguage();
    const { getStats: getDonationStats } = useDonation();
    const { getStats: getImpactStats } = useImpact();
    const [donationStats, setDonationStats] = useState(null);
    const [impactStats, setImpactStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const donationResult = await getDonationStats();
            if (donationResult.success) {
                setDonationStats(donationResult.data);
            }

            const impactResult = await getImpactStats();
            if (impactResult.success) {
                setImpactStats(impactResult.data);
            }
        };
        fetchData();
    }, []);

    // Statistics data
    const stats = [
        {
            icon: HomeIcon,
            value: donationStats ? formatCurrency(donationStats.totalAmount) : '$0',
            label: t('stats.donated'),
            color: 'text-primary'
        },
        {
            icon: Users,
            value: donationStats ? donationStats.totalDonations.toString() : '0',
            label: t('stats.helped'),
            color: 'text-accent-gold'
        },
        {
            icon: Heart,
            value: impactStats ? impactStats.totalImpacts.toString() : '0',
            label: t('stats.projects'),
            color: 'text-primary-dark'
        },
        { icon: TrendingUp, value: '50+', label: t('stats.volunteers'), color: 'text-primary' },
    ];

    // Sample testimonials
    const testimonials = [
        {
            name: 'Ahmad Rashid',
            location: 'United States',
            message: 'AFGHANIUM made it easy to help my homeland. I can see exactly where my donation goes and the real impact it makes.',
            amount: 500,
        },
        {
            name: 'Fatima Karimi',
            location: 'Germany',
            message: 'Transparent, trustworthy, and truly making a difference. I donate monthly and receive updates on the projects my contributions support.',
            amount: 250,
        },
        {
            name: 'Mohammad Ali',
            location: 'Canada',
            message: 'The tracking system gives me peace of mind. I know my charity reaches those who need it most in Afghanistan.',
            amount: 1000,
        },
    ];

    return (
        <div>
            {/* Hero Section */}
            <Hero
                title={t('hero.title')}
                subtitle={t('hero.subtitle')}
                ctaText={t('hero.cta')}
                ctaLink="/donate"
                backgroundImage="/cover-photo.png"
            />

            {/* Real-Time Donation Ticker */}
            <DonationTicker />

            {/* Emergency Departments Section */}
            <EmergencyDepartments />

            {/* Animated Statistics Section */}
            <StatsSection />

            {/* Departments Section */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <SectionTitle
                        title={t('departments.title')}
                        subtitle={t('departments.subtitle')}
                    />
                    <Departments limit={6} />

                    <div className="text-center mt-12">
                        <CTAButton to="/departments" variant="outline" size="lg">
                            {t('departments.viewAll')}
                        </CTAButton>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="section-padding bg-gray-50 afghan-pattern-bg">
                <div className="container-custom">
                    <SectionTitle
                        title="What Donors Say"
                        subtitle="Real stories from people making a difference"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard key={index} testimonial={testimonial} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding hero-gradient text-white relative overflow-hidden">
                <div className="afghan-pattern-bg absolute inset-0 opacity-10" />
                <div className="container-custom relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Make a Difference Today
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Your generosity can transform lives across Afghanistan. Every donation, no matter the size, creates lasting impact.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <CTAButton to="/donate" size="lg" variant="gold">
                            {t('nav.donate')}
                        </CTAButton>
                        <CTAButton to="/impact" size="lg" variant="outline" className="!text-white !border-white hover:!bg-white hover:!text-primary">
                            {t('nav.impact')}
                        </CTAButton>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
