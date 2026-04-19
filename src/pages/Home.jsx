import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    CheckCircle2,
    HeartHandshake,
    Leaf,
    MapPin,
    Quote,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDonation } from '../hooks/useDonation';
import { useImpact } from '../hooks/useImpact';
import { formatCurrency } from '../utils/formatters';
import { getTestimonials } from '../supabase/testimonials';
import { getContent } from '../supabase/content';
import { getTestimonialImageUrl } from '../supabase/storage';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

const SectionHeader = ({ eyebrow, title, subtitle }) => (
    <div className="mb-8 text-center">
        {eyebrow ? (
            <Badge variant="secondary" className="mb-3 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                {eyebrow}
            </Badge>
        ) : null}
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
        {subtitle ? <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{subtitle}</p> : null}
    </div>
);

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
            if (donationResult.success) setDonationStats(donationResult.data);

            const impactResult = await getImpactStats();
            if (impactResult.success) setImpactStats(impactResult.data);

            const testimonialsResult = await getTestimonials();
            if (testimonialsResult.success) setTestimonials(testimonialsResult.data);

            const aboutUsResult = await getContent('about_us_short');
            if (aboutUsResult.success && aboutUsResult.data) setAboutUsShort(aboutUsResult.data);
        };

        fetchData();
    }, [getDonationStats, getImpactStats]);

    const summaryStats = [
        {
            icon: TrendingUp,
            label: 'Total raised',
            value: donationStats ? formatCurrency(donationStats.totalRaised || 0) : '—',
            hint: 'Verified donations',
        },
        {
            icon: Users,
            label: 'Donations tracked',
            value: donationStats ? `${donationStats.totalDonations || 0}` : '—',
            hint: 'Live count',
        },
        {
            icon: Sparkles,
            label: 'Lives impacted',
            value: donationStats ? `${donationStats.livesImpacted || 0}` : '—',
            hint: 'Estimated impact',
        },
        {
            icon: CheckCircle2,
            label: 'Active projects',
            value: impactStats ? `${impactStats.activeProjects || impactStats.totalProjects || 0}` : '—',
            hint: 'Ongoing work',
        },
    ];

    const pillars = [
        {
            icon: Leaf,
            title: 'Trade first',
            description: 'Market access for Afghan producers.',
        },
        {
            icon: HeartHandshake,
            title: 'Support directly',
            description: 'Donations target urgent needs.',
        },
        {
            icon: ShieldCheck,
            title: 'Track clearly',
            description: 'Transparent updates and outcomes.',
        },
    ];

    const featuredProducts = [
        { name: 'Afghan Saffron', description: 'Premium quality with global demand.' },
        { name: 'Handmade Rugs', description: 'Traditional designs from Afghan artisans.' },
        { name: 'Leather Goods', description: 'Durable handcrafted export products.' },
        { name: 'Gemstones & Crafts', description: 'Authentic Afghan stones and crafts.' },
    ];

    const aboutPreview = aboutUsShort
        ? `${aboutUsShort.trim().slice(0, 190)}${aboutUsShort.trim().length > 190 ? '...' : ''}`
        : '';

    return (
        <div className="bg-background text-foreground">
            <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-primary/5 to-background">
                <div className="absolute -left-20 top-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                <div className="container-custom relative z-10 py-16 md:py-22 lg:py-28">
                    <div className="mx-auto max-w-4xl text-center">
                        <Badge variant="secondary" className="mb-5 inline-flex gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em]">
                            <Sparkles className="h-3.5 w-3.5" />
                            One clear platform
                        </Badge>

                        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Buy with purpose.
                            <span className="block text-primary">Support with confidence.</span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                            Afghanium combines trade and humanitarian support without confusion: shop, donate, then track outcomes.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Button asChild size="lg" className="h-12 rounded-full px-6">
                                <Link to="/shop">Explore products</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6">
                                <Link to="/donate">Donate now</Link>
                            </Button>
                            <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-4">
                                <Link to="/track" className="inline-flex items-center gap-2">
                                    Track donation
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {pillars.map((pillar) => {
                                const Icon = pillar.icon;
                                return (
                                    <div key={pillar.title} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                                        <Icon className="h-4 w-4 text-primary" />
                                        <span>{pillar.title}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-gradient-to-b from-background to-primary/5">
                <div className="container-custom">
                    <SectionHeader title="Impact at a glance" subtitle="Fast numbers for fast decisions." />
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {summaryStats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={stat.label} className="border-border/70 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <CardDescription className="text-sm font-medium">{stat.label}</CardDescription>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                        </div>
                                        <CardTitle className="font-display text-3xl">{stat.value}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <p className="text-sm text-muted-foreground">{stat.hint}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section-padding bg-background">
                <div className="container-custom grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                    <Card className="border-border/70 shadow-sm">
                        <CardHeader>
                            <Badge variant="secondary" className="mb-4 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em]">
                                About Afghanium
                            </Badge>
                            <CardTitle className="font-display text-3xl tracking-tight sm:text-4xl">
                                Built for trade, accountability, and impact.
                            </CardTitle>
                            <CardDescription className="mt-2 text-base leading-7">
                                {aboutPreview || 'We combine Afghan trade, direct support, and transparent reporting in one practical model.'}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex flex-wrap gap-3 pt-0">
                                <Button asChild className="rounded-full px-6">
                                    <Link to="/about">Learn our story</Link>
                                </Button>
                                <Button asChild variant="outline" className="rounded-full px-6">
                                    <Link to="/contact">Talk to us</Link>
                                </Button>
                        </CardFooter>
                    </Card>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {[
                            { title: 'Fair trade focus', description: 'Global market access for Afghan producers.' },
                            { title: 'Healthcare support', description: 'Women-focused clinics and urgent care.' },
                            { title: 'Research hub', description: 'Practical research for real decisions.' },
                            { title: 'Transparent reporting', description: 'Visible progress and clear updates.' },
                        ].map((item) => (
                            <Card key={item.title} className="border-border/70 shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-base leading-tight">{item.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <CardDescription>{item.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding bg-muted/20">
                <div className="container-custom">
                    <SectionHeader title="Marketplace with purpose" subtitle="Explore key Afghan exports in one quick scan." />
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <Card key={product.name} className="border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardHeader className="pb-2">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Leaf className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <CardDescription>{product.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
                <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="container-custom relative z-10">
                    <SectionHeader title="What supporters say" subtitle="Short social proof from people backing the mission." />
                    {testimonials.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {testimonials.map((testimonial, index) => {
                                const imageSrc = testimonial.image_url ? getTestimonialImageUrl(testimonial.image_url) : null;

                                return (
                                    <Card
                                        key={testimonial.id || index}
                                        className="group border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="mb-4 flex justify-center">
                                                <div className="rounded-full bg-primary/10 p-3 text-primary">
                                                    <Quote className="h-5 w-5" />
                                                </div>
                                            </div>

                                            <CardDescription className="text-center text-sm leading-7">
                                                "{testimonial.message}"
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="pt-0 text-center">
                                                {imageSrc ? (
                                                    <img
                                                        src={imageSrc}
                                                        alt={testimonial.name}
                                                        className="mx-auto mb-3 h-14 w-14 rounded-full object-cover ring-2 ring-primary/20"
                                                    />
                                                ) : null}
                                                <CardTitle className="text-base">{testimonial.name}</CardTitle>
                                                {testimonial.location ? (
                                                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {testimonial.location}
                                                    </p>
                                                ) : null}
                                        </CardContent>

                                            {testimonial.amount ? (
                                                <CardFooter className="justify-center border-t border-border pt-4">
                                                    <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/5 text-primary">
                                                        Donated ${testimonial.amount}
                                                    </Badge>
                                                </CardFooter>
                                            ) : null}
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="border-border/70 bg-card shadow-sm">
                            <CardHeader>
                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Testimonials</CardDescription>
                                <CardTitle className="text-2xl">Supporter stories will appear here</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Published testimonials are shown in this section as soon as they are approved.</p>
                            </CardContent>
                        </Card>
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
                        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
                            Buy with purpose, donate with clarity, and follow the impact.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Button asChild size="lg" className="h-12 rounded-full bg-white px-8 text-primary hover:bg-white/90">
                                <Link to="/donate">{t('nav.donate')}</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white px-8 text-white hover:bg-white hover:text-primary">
                                <Link to="/impact">{t('nav.impact')}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
