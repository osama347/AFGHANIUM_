
import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import { Target, Heart, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { getContent } from '../supabase/content';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
    const { t } = useLanguage();
    const [missionDescription, setMissionDescription] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            const result = await getContent('about_us');
            if (result.success && result.data) {
                setMissionDescription(result.data);
            }
        };
        fetchContent();
    }, []);

    const mission = {
        title: t('about.mission.title'),
        description: t('about.mission.description'),
        icon: Target,
    };

    const vision = {
        title: t('about.vision.title'),
        description: t('about.vision.description'),
        icon: Heart,
    };

    const values = [
        {
            title: t('about.values.dignity.title'),
            description: t('about.values.dignity.description'),
            icon: Users,
        },
        {
            title: t('about.values.womensHealth.title'),
            description: t('about.values.womensHealth.description'),
            icon: Heart,
        },
        {
            title: t('about.values.transparency.title'),
            description: t('about.values.transparency.description'),
            icon: TrendingUp,
        },
        {
            title: t('about.values.quality.title'),
            description: t('about.values.quality.description'),
            icon: Target,
        },
    ];

    const goals = t('about.goals.list', { returnObjects: true }) || [];

    return (
        <div>
            <Hero
                title={t('nav.about')}
                subtitle={t('hero.subtitle')}
                backgroundImage="/About%20As.png"
            />

            {/* Mission & Vision */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[mission, vision].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                                        <item.icon className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h2>
                                <p className="text-lg text-gray-600 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="section-padding bg-secondary-light afghan-pattern-bg">
                <div className="container-custom">
                    <SectionTitle
                        title={t('about.values.title')}
                        subtitle={t('about.values.subtitle')}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 shadow-md card-hover text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <value.icon className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Goals */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <SectionTitle
                            title={t('about.goals.title')}
                            subtitle={t('about.goals.subtitle')}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {Array.isArray(goals) && goals.map((goal, index) => (
                                <div key={index} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 font-medium">{goal}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding hero-gradient text-white">
                <div className="container-custom text-center">
                    <h2 className="text-4xl font-bold mb-6">Join Us in Our Mission</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Together, we can create lasting change and build a brighter future for Afghanistan
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/donate"
                            className="btn-primary bg-white !text-primary hover:!bg-gray-100"
                        >
                            Make a Donation
                        </a>
                        <a
                            href="/contact"
                            className="btn-primary !bg-transparent border-2 !border-white hover:!bg-white hover:!text-primary"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
