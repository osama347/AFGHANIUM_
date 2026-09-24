import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MapPin, Quote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDonation } from '../hooks/useDonation';
import { formatCurrency } from '../utils/formatters';
import { getTestimonials } from '../supabase/testimonials';
import { getContent } from '../supabase/content';
import { getTestimonialImageUrl } from '../supabase/storage';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-10 max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-2 text-base text-muted-foreground">{subtitle}</p> : null}
    </div>
);

const Home = () => {
    const { t } = useLanguage();
    const { getStats: getDonationStats } = useDonation();
    const [donationStats, setDonationStats] = useState(null);
    const [testimonials, setTestimonials] = useState([]);
    const [aboutUsShort, setAboutUsShort] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const donationResult = await getDonationStats();
            if (donationResult.success) setDonationStats(donationResult.data);

            const testimonialsResult = await getTestimonials();
            if (testimonialsResult.success) setTestimonials(testimonialsResult.data);

            const aboutUsResult = await getContent('about_us_short');
            if (aboutUsResult.success && aboutUsResult.data) setAboutUsShort(aboutUsResult.data);
        };

        fetchData();
    }, [getDonationStats]);

    const stats = [
        { label: 'Total raised', value: donationStats ? formatCurrency(donationStats.totalRaised || 0) : '—' },
        { label: 'Donations', value: donationStats ? `${donationStats.totalDonations || 0}` : '—' },
        { label: 'Lives impacted', value: donationStats ? `${donationStats.livesImpacted || 0}` : '—' },
    ];

    const commitments = [
        'Fair-trade market access for Afghan producers',
        'Direct funding for women-focused healthcare',
        'Every donation tracked from gift to outcome',
    ];

    const featuredProducts = [
        { name: 'Afghan Saffron', description: 'Premium quality with global demand.' },
        { name: 'Handmade Rugs', description: 'Traditional designs from Afghan artisans.' },
        { name: 'Leather Goods', description: 'Durable handcrafted export products.' },
        { name: 'Gemstones & Crafts', description: 'Authentic Afghan stones and crafts.' },
    ];

    const aboutPreview = aboutUsShort
        ? `${aboutUsShort.trim().slice(0, 220)}${aboutUsShort.trim().length > 220 ? '...' : ''}`
        : 'We combine Afghan trade, direct support, and transparent reporting in one practical model.';

    return (
        <div className="bg-background text-foreground">
            {/* Hero */}
            <section className="border-b border-border">
                <div className="container-custom py-16 sm:py-20 lg:py-24">
                    <div className="max-w-2xl">
                        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
                            Trade that funds care, tracked all the way through.
                        </h1>
                        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                            Afghanium sells authentic Afghan products and puts part of every sale toward
                            direct humanitarian support — with every donation traceable to its outcome.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button asChild size="lg">
                                <Link to="/donate">Donate now</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link to="/shop">Shop products</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats — plain numbers, no cards */}
            <section className="border-b border-border">
                <div className="container-custom py-10">
                    <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                        {stats.map((stat) => (
                            <div key={stat.label} className="py-4 text-center first:pt-0 sm:py-0 sm:first:pl-0">
                                <div className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
                                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="section-padding">
                <div className="container-custom grid gap-10 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Built for trade, accountability, and impact.
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{aboutPreview}</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button asChild variant="outline">
                                <Link to="/about">Read our story</Link>
                            </Button>
                            <Button asChild variant="ghost">
                                <Link to="/contact">Contact us</Link>
                            </Button>
                        </div>
                    </div>

                    <ul className="space-y-4">
                        {commitments.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <span className="text-base text-foreground">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Products */}
            <section className="section-padding border-t border-border bg-muted/40">
                <div className="container-custom">
                    <SectionHeader title="From the shop" subtitle="A few of the Afghan exports available today." />
                    <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <div key={product.name} className="bg-card p-6">
                                <h3 className="font-semibold text-foreground">{product.name}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6">
                        <Button asChild variant="outline">
                            <Link to="/shop">View all products</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            {testimonials.length > 0 && (
                <section className="section-padding">
                    <div className="container-custom">
                        <SectionHeader title="From our supporters" />
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {testimonials.slice(0, 3).map((testimonial, index) => {
                                const imageSrc = testimonial.image_url ? getTestimonialImageUrl(testimonial.image_url) : null;

                                return (
                                    <Card key={testimonial.id || index} className="shadow-none">
                                        <CardHeader className="pb-3">
                                            <Quote className="h-5 w-5 text-primary/50" />
                                            <CardDescription className="text-sm leading-relaxed text-foreground/80">
                                                "{testimonial.message}"
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex items-center gap-3 pt-0">
                                            {imageSrc ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={testimonial.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : null}
                                            <div>
                                                <CardTitle className="text-sm">{testimonial.name}</CardTitle>
                                                {testimonial.location ? (
                                                    <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MapPin className="h-3 w-3" />
                                                        {testimonial.location}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-primary text-primary-foreground">
                <div className="container-custom py-16 text-center sm:py-20">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Support Afghanistan through trade and giving
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
                        Every donation is tracked from gift to outcome.
                    </p>
                    <div className="mt-7">
                        <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                            <Link to="/donate">{t('nav.donate')}</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
