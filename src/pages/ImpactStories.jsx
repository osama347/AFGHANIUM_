import React from 'react';
import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, Target, Heart, BookOpen } from 'lucide-react';
import CTAButton from '../components/CTAButton';

const ImpactStories = () => {
    const { t } = useLanguage();

    const roadmapSections = [
        {
            title: "Why We Exist",
            icon: Target,
            content: `Afghanistan is not lacking talent or quality—it is lacking access. Across the country, farmers, artists, and small producers create products that can compete globally, but many are blocked from international markets for practical reasons: limited export channels, difficult logistics, payment barriers, weak market visibility, and the absence of long-term trade relationships. The result is that exceptional Afghan products often remain trapped in local markets, sold below their true value, or never reach customers who would gladly buy them.

Afghanium is built to change that.

We create a bridge between Afghan producers and global customers—so Afghan-made work can be seen, trusted, purchased, and repeated at scale.`
        },
        {
            title: "The Market Access Problem",
            icon: ArrowRight,
            content: `A clear example is Afghan saffron: it is frequently recognized for top-tier quality, yet many saffron farmers still struggle to reach consistent global demand due to market access and trade barriers. The same is true for other Afghan strengths—gemstones, handmade rugs, leather goods, and traditional arts—high-value products with limited pathways to international buyers.

Our goal is to turn that potential into real income and stability for producers by:
• Building reliable customer access abroad
• Improving visibility and trust through quality and transparency
• Ensuring trade is handled responsibly and legally`
        },
        {
            title: "Why We Also Invest in Healthcare",
            icon: Heart,
            content: `Afghanistan's medical sector faces ongoing strain and requires as much support as possible to deliver professional care—especially for women. In many contexts, healthcare remains one of the few sectors where women can still work and serve their communities. For that reason, Afghanium dedicates a portion of profit generated from trade to support women-focused healthcare initiatives, including women-only clinics staffed by women.

In short: we use trade to unlock Afghan potential—and we reinvest part of its success into women's healthcare.`
        }
    ];

    return (
        <div>
            <Hero
                title="Impact Roadmap: Why Afghanium Exists"
                subtitle="Understanding our mission to connect Afghan producers with the global market"
                backgroundImage="/Impect-Stories.jpg"
            />

            <section className="section-padding bg-white">
                <div className="container-custom max-w-4xl mx-auto">
                    <div className="space-y-16">
                        {roadmapSections.map((section, index) => {
                            const Icon = section.icon;
                            return (
                                <div key={index} className="space-y-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                                    </div>
                                    <div className="prose max-w-none">
                                        <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {section.content}
                                        </p>
                                    </div>
                                    {index < roadmapSections.length - 1 && (
                                        <div className="my-8 border-t-2 border-primary-light" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 bg-gradient-to-r from-primary-light to-primary rounded-xl p-12 text-white">
                        <h3 className="text-3xl font-bold mb-4">Join Us in Building This Bridge</h3>
                        <p className="text-lg mb-8 opacity-90">
                            Every purchase and donation strengthens Afghan producers and supports women's healthcare. Together, we're creating opportunity from Afghan excellence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <CTAButton 
                                to="/donate" 
                                variant="gold" 
                                size="lg"
                                className="inline-flex items-center justify-center gap-2"
                            >
                                Support Our Mission <ArrowRight className="w-4 h-4" />
                            </CTAButton>
                            <CTAButton 
                                to="/about" 
                                variant="outline"
                                size="lg"
                                className="inline-flex items-center justify-center gap-2 !text-white !border-white hover:!bg-white hover:!text-primary"
                            >
                                Learn More About Us
                            </CTAButton>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ImpactStories;
