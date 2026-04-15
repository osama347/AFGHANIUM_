import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, HeartHandshake, Leaf, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDonation } from '../hooks/useDonation';
import { useImpact } from '../hooks/useImpact';
import { formatCurrency } from '../utils/formatters';
import DonationTicker from '../components/DonationTicker';
import SectionTitle from '../components/SectionTitle';
import TestimonialCard from '../components/TestimonialCard';
import CTAButton from '../components/CTAButton';
import { getTestimonials } from '../supabase/testimonials';
import { getContent } from '../supabase/content';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

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
    }, [getDonationStats, getImpactStats]);

    const featuredProducts = [
        {
            name: 'Afghan Saffron',
            description: 'Premium-grade saffron grown by Afghan farmers with strong global demand.',
        },
        {
            name: 'Handmade Afghan Rugs',
            description: 'Traditional rugs crafted by skilled Afghan artisans with heritage techniques.',
        },
        {
            name: 'Leather Goods',
            description: 'Durable handcrafted leather items made by Afghan workshops and small producers.',
        },
        {
            name: 'Gemstones & Crafts',
            description: 'Authentic Afghan gemstones and handmade products prepared for international buyers.',
        },
    ];

    const pillars = [
        {
            icon: Leaf,
            title: 'Trade first, charity second',
            description: 'We build market access for Afghan producers and keep donations as a direct support channel.',
        },
        {
            icon: HeartHandshake,
            title: 'Practical humanitarian support',
            description: 'Donations stay focused on urgent needs, especially women-focused healthcare and emergency relief.',
        },
        {
            icon: ShieldCheck,
            title: 'Transparent and traceable',
            description: 'Every contribution is tracked so supporters can see the work behind the numbers.',
        },
    ];

    const summaryStats = [
        {
            icon: TrendingUp,
            label: 'Total raised',
            value: donationStats ? formatCurrency(donationStats.totalRaised || 0) : '—',
            hint: 'Across verified donations',
        },
        {
            icon: Users,
            label: 'Donations tracked',
            value: donationStats ? `${donationStats.totalDonations || 0}` : '—',
            hint: 'Completed and pending support',
        },
        {
            icon: Sparkles,
            label: 'Lives impacted',
            value: donationStats ? `${donationStats.livesImpacted || 0}` : '—',
            hint: 'Estimated from funded relief',
        },
        {
            icon: CheckCircle2,
            label: 'Active projects',
            value: impactStats ? `${impactStats.activeProjects || impactStats.totalProjects || 0}` : '—',
            hint: 'Ongoing and public work',
        },
    ];

    const heroHighlights = [
        'Afghan products for global buyers',
        'Women-focused healthcare support',
        'Research and impact with transparency',
    ];

    return (
        <div className="bg-background text-foreground">
            <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-background via-primary/5 to-primary/10">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

                <div className="container-custom relative z-10 py-16 md:py-24">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="max-w-3xl">
                            <Badge variant="secondary" className="mb-6 gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Social enterprise with purpose
                            </Badge>

                            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                Trade with purpose.
                                <span className="block text-primary">Give with clarity.</span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                                Afghanium connects authentic Afghan products to global buyers while keeping donations as a focused, transparent channel for direct impact.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg" className="h-12 rounded-full px-6 shadow-lg shadow-primary/20">
                                    <Link to="/donate">Donate now</Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-6">
                                    <Link to="/shop">Explore products</Link>
                                </Button>
                                <Button asChild variant="ghost" size="lg" className="h-12 rounded-full px-4 text-muted-foreground hover:text-foreground">
                                    <Link to="/track" className="inline-flex items-center gap-2">
                                        Track donation
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {heroHighlights.map((item) => (
                                    <div
                                        key={item}
                                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow-sm"
                                    >
                                        <span className="h-2 w-2 rounded-full bg-primary" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-2xl" />
                            <Card className="relative overflow-hidden rounded-[2rem] border-border/70 bg-card/95 shadow-2xl backdrop-blur">
                                <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                                What we do
                                            </CardDescription>
                                            <CardTitle className="mt-2 text-2xl">A cleaner model for Afghanistan</CardTitle>
                                        </div>
                                        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                            Live
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5 p-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-border bg-background p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                                Product market
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-foreground">
                                                We help Afghan producers reach buyers with quality, trust, and long-term relationships.
                                            </p>
                                        </div>
                                        <div className="rounded-2xl border border-border bg-background p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                                Direct impact
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-foreground">
                                                Donations support urgent needs with a focus on healthcare, relief, and measurable outcomes.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10 p-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-foreground">Operating principles</p>
                                            <Badge variant="outline" className="rounded-full border-primary/20 text-primary">
                                                3 pillars
                                            </Badge>
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            {pillars.map((pillar) => {
                                                const Icon = pillar.icon;

                                                return (
                                                    <div key={pillar.title} className="flex gap-3 rounded-2xl bg-background/80 p-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                            <Icon className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-foreground">{pillar.title}</p>
                                                            <p className="mt-1 text-sm leading-6 text-muted-foreground">{pillar.description}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <DonationTicker />

            <section className="section-padding bg-gradient-to-b from-background to-primary/5">
                <div className="container-custom">
                    <SectionTitle
                        title="A clearer picture of impact"
                        subtitle="The numbers matter when they sit inside a design that is easy to scan and easy to trust."
                    />

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {summaryStats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <Card key={stat.label} className="border-border/70 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                                <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
                                                    {stat.value}
                                                </p>
                                                <p className="mt-2 text-sm leading-6 text-muted-foreground">{stat.hint}</p>
                                            </div>
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {aboutUsShort && (
                <section className="section-padding bg-white">
                    <div className="container-custom">
                        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
                            <div>
                                <Badge variant="secondary" className="mb-4 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em]">
                                    About Afghanium
                                </Badge>
                                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                    Built for trade, accountability, and impact.
                                </h2>
                                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground whitespace-pre-wrap">
                                    {aboutUsShort}
                                </p>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Button asChild className="rounded-full px-6">
                                            <Link to="/about">Learn our story</Link>
                                    </Button>
                                    <Button asChild variant="outline" className="rounded-full px-6">
                                            <Link to="/contact">Talk to us</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    {
                                        title: 'Fair trade focus',
                                        description: 'We connect Afghan producers to international buyers through durable, trust-based commerce.',
                                    },
                                    {
                                        title: 'Healthcare support',
                                        description: 'A portion of the mission supports women-only clinics staffed by women professionals.',
                                    },
                                    {
                                        title: 'Research hub',
                                        description: 'We publish practical research to support evidence-based work in Afghanistan.',
                                    },
                                    {
                                        title: 'Transparent reporting',
                                        description: 'Supporters can follow the work instead of guessing what happened to the donation.',
                                    },
                                ].map((item) => (
                                    <Card key={item.title} className="border-border/70 shadow-sm">
                                        <CardContent className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </div>
                                                <p className="font-semibold text-foreground">{item.title}</p>
                                            </div>
                                            <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className="section-padding bg-muted/30">
                <div className="container-custom">
                    <SectionTitle
                        title="Marketplace with purpose"
                        subtitle="The home page should tell the model in one glance: trade products, support people, and keep the operation understandable."
                    />

                    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
                        <Card className="border-border/70 bg-card shadow-sm">
                            <CardHeader>
                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                                    Our model
                                </CardDescription>
                                <CardTitle className="text-2xl">A two-channel system that stays simple</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <p className="text-sm font-semibold text-foreground">1. Sell Afghan products globally</p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        We focus on market access: premium products, better visibility, and reliable distribution for Afghan producers.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <p className="text-sm font-semibold text-foreground">2. Keep donations for direct impact</p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Donations remain a clear support path for emergency response, healthcare, and other urgent needs.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                                    <p className="text-sm font-semibold text-foreground">Why it works</p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        It combines dignity, sustainability, and humanitarian aid without forcing the brand into a single-purpose box.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {featuredProducts.map((product) => (
                                <Card key={product.name} className="border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <Leaf className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{product.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[2rem] border border-primary/10 bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-6 text-center shadow-sm lg:flex-row lg:text-left">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Next step</p>
                            <h3 className="mt-2 text-2xl font-bold text-foreground">See the mission, then support it.</h3>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
                            <CTAButton to="/about" variant="outline" size="lg" className="inline-flex items-center gap-2">
                                Learn how it works <ArrowRight className="h-4 w-4" />
                            </CTAButton>
                            <CTAButton to="/donate" variant="primary" size="lg">
                                Support through donation
                            </CTAButton>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
                <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

                <div className="container-custom relative z-10">
                    <SectionTitle
                        title="What supporters say"
                        subtitle="Real stories from people who back the work and understand the model."
                    />

                    {testimonials.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {testimonials.map((testimonial, index) => (
                                <TestimonialCard key={testimonial.id || index} testimonial={testimonial} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                            <Card className="border-border/70 bg-card shadow-sm">
                                <CardHeader>
                                    <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                                        Testimonials
                                    </CardDescription>
                                    <CardTitle className="text-2xl">Supporters help define the story</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-7 text-muted-foreground">
                                        Testimonial content will appear here once published. The layout is prepared so the section reads as a polished, magazine-style panel rather than an empty placeholder.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
                                <CardContent className="p-6">
                                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Trust signals</p>
                                    <ul className="mt-4 space-y-3 text-sm leading-7 text-foreground">
                                        <li className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />Transparent tracking across donations and impact.</li>
                                        <li className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />A product-first model that avoids dependency-only messaging.</li>
                                        <li className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />A support structure designed to look and feel credible.</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </section>

            <section className="section-padding bg-gradient-to-br from-primary-dark to-primary text-white relative overflow-hidden">
                <div className="afghan-pattern-bg absolute inset-0 opacity-10" />
                <div className="container-custom relative z-10">
                    <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-md sm:p-12">
                        <Badge variant="secondary" className="mb-5 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            Ready to act
                        </Badge>
                        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Support Afghanistan through trade and giving
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
                            Buy authentic Afghan products through the social enterprise model, and back additional impact through targeted donations.
                        </p>

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <CTAButton to="/donate" size="lg" variant="gold">
                                {t('nav.donate')}
                            </CTAButton>
                            <CTAButton
                                to="/impact"
                                size="lg"
                                variant="outline"
                                className="!border-white !text-white hover:!bg-white hover:!text-primary"
                            >
                                {t('nav.impact')}
                            </CTAButton>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;