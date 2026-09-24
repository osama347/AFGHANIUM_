import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Quote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDonation } from '../hooks/useDonation';
import { formatCurrency } from '../utils/formatters';
import { getTestimonials } from '../supabase/testimonials';
import { getContent } from '../supabase/content';
import { getTestimonialImageUrl } from '../supabase/storage';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import SectionHeading from '../components/SectionHeading';

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

    const commitments = [
        'Fair-trade market access for Afghan producers',
        'Direct funding for women-focused healthcare',
        'Every donation tracked from gift to outcome',
    ];

    const featuredProducts = [
        { name: 'Afghan Saffron', description: 'Premium quality, harvested by hand and sold at a fair price direct from growers.' },
        { name: 'Handmade Rugs', description: 'Traditional designs from Afghan artisans.' },
        { name: 'Leather Goods', description: 'Durable handcrafted export products.' },
        { name: 'Gemstones & Crafts', description: 'Authentic Afghan stones and crafts.' },
        { name: 'Dried Fruits & Nuts', description: 'Sun-dried and sourced direct from Afghan orchards.' },
    ];

    const aboutPreview = aboutUsShort
        ? `${aboutUsShort.trim().slice(0, 220)}${aboutUsShort.trim().length > 220 ? '...' : ''}`
        : 'We combine Afghan trade, direct support, and transparent reporting in one practical model.';

    return (
        <div className="bg-background text-foreground">
            {/* Hero */}
            <section className="border-b border-border">
                <div className="container-custom py-16 sm:py-20 lg:py-24">
                    <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
                        <div className="lg:col-span-7">
                            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                Trade &amp; humanitarian support
                            </p>
                            <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                                Trade that funds care, tracked all the way through.
                            </h1>
                            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
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

                        <div className="lg:col-span-5">
                            <div className="border border-ink bg-ink p-8 text-white">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Total raised</p>
                                <p className="mt-3 font-display text-5xl font-bold tracking-tight text-primary-light">
                                    {donationStats ? formatCurrency(donationStats.totalRaised || 0) : '—'}
                                </p>
                                <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
                                    <div>
                                        <p className="font-display text-2xl font-bold">
                                            {donationStats ? donationStats.totalDonations || 0 : '—'}
                                        </p>
                                        <p className="mt-1 text-xs text-white/50">Donations</p>
                                    </div>
                                    <div>
                                        <p className="font-display text-2xl font-bold">
                                            {donationStats ? donationStats.livesImpacted || 0 : '—'}
                                        </p>
                                        <p className="mt-1 text-xs text-white/50">Lives impacted</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="section-padding">
                <div className="container-custom">
                    <SectionHeading index="01" title="About Afghanium" />

                    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                        <div className="lg:col-span-5">
                            <h3 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Built for trade, accountability, and impact.
                            </h3>
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

                        <div className="lg:col-span-7">
                            <ul className="divide-y divide-border border-t border-border">
                                {commitments.map((item, i) => (
                                    <li key={item} className="flex items-center gap-6 py-5">
                                        <span className="font-display text-2xl font-bold text-border">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-base text-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="section-padding border-t border-border bg-muted/30">
                <div className="container-custom">
                    <SectionHeading
                        index="02"
                        title="From the shop"
                        cta={
                            <Button asChild variant="outline">
                                <Link to="/shop">View all products</Link>
                            </Button>
                        }
                    />

                    <div className="grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-4 lg:grid-rows-2">
                        <div className="flex min-h-[260px] flex-col justify-between bg-ink p-8 text-white lg:col-span-2 lg:row-span-2">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Featured</p>
                                <h3 className="mt-4 font-display text-3xl font-bold">{featuredProducts[0].name}</h3>
                                <p className="mt-3 text-white/70">{featuredProducts[0].description}</p>
                            </div>
                            <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-light">
                                Shop now
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {featuredProducts.slice(1).map((product) => (
                            <div key={product.name} className="bg-card p-6">
                                <h3 className="font-semibold text-foreground">{product.name}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            {testimonials.length > 0 && (
                <section className="section-padding">
                    <div className="container-custom">
                        <SectionHeading index="03" title="From our supporters" />
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {testimonials.slice(0, 3).map((testimonial, index) => {
                                const imageSrc = testimonial.image_url ? getTestimonialImageUrl(testimonial.image_url) : null;

                                return (
                                    <Card key={testimonial.id || index}>
                                        <CardHeader className="pb-3">
                                            <Quote className="h-5 w-5 text-primary/40" />
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
                <div className="container-custom py-20 sm:py-28">
                    <div className="max-w-2xl">
                        <h2 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                            Support Afghanistan through trade and giving
                        </h2>
                        <p className="mt-4 text-lg text-primary-foreground/85">
                            Every donation is tracked from gift to outcome.
                        </p>
                        <div className="mt-8">
                            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                                <Link to="/donate">{t('nav.donate')}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
