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
import { Home as HomeIcon, Heart, Users, TrendingUp, ArrowRight } from 'lucide-react';
import CTAButton from '../components/CTAButton';
import TestimonialCard from '../components/TestimonialCard';
import { getTestimonials } from '../supabase/testimonials';
import { getContent } from '../supabase/content';

const Home = () => {
    const { t } = useLanguage();
    const { getStats: getDonationStats } = useDonation();
    const { getStats: getImpactStats } = useImpact();
    const [donationStats, setDonationStats] = useState(null);
    const [impactStats, setImpactStats] = useState(null);
    const [testimonials, setTestimonials] = useState([]);
    const [aboutUsShort, setAboutUsShort] = useState('');

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

            const testimonialsResult = await getTestimonials();
            if (testimonialsResult.success) {
                setTestimonials(testimonialsResult.data);
            }

            const aboutUsResult = await getContent('about_us_short');
            if (aboutUsResult.success && aboutUsResult.data) {
                setAboutUsShort(aboutUsResult.data);
            }
        };
        fetchData();
    }, []);

    // Statistics data is handled by StatsSection component

    return (
        <div>
            {/* Hero Section */}
            <Hero
                title={t('hero.title')}
                subtitle={t('hero.subtitle')}
                ctaText={t('hero.cta')}
                ctaLink="/donate"
            />

            {/* Real-Time Donation Ticker */}
            <DonationTicker />

            {/* Emergency Departments Section */}
            <EmergencyDepartments />

            {/* Animated Statistics Section */}
            <StatsSection />

            {/* About Us Section */}
            {aboutUsShort && (
                <section className="section-padding bg-white">
                    <div className="container-custom">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-6">About Afghanium</h2>
                                <p className="text-lg text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">
                                    {aboutUsShort}
                                </p>
                                <CTAButton to="/about" variant="outline" size="lg" className="inline-flex items-center gap-2">
                                    Learn Our Full Story <ArrowRight className="w-4 h-4" />
                                </CTAButton>
                            </div>
                            <div className="hidden lg:block">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light rounded-lg blur-lg opacity-20" />
                                    <div className="relative bg-gradient-to-br from-primary to-primary-light rounded-lg p-12 text-white">
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2">Fair Trade</h3>
                                                <p className="opacity-90">Connecting Afghan producers with global customers through dignified work and sustainable relationships.</p>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2">Women's Healthcare</h3>
                                                <p className="opacity-90">Reinvesting profits into women-only clinics staffed by women professionals.</p>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2">Research & Knowledge</h3>
                                                <p className="opacity-90">Publishing free research to support evidence-based action for Afghanistan's future.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

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
            <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl" />
                
                <div className="container-custom relative z-10">
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
