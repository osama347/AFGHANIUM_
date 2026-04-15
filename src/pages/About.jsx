import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Heart, ShieldCheck, Sparkles, Target, TrendingUp, Users, Globe } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { getContent } from '../supabase/content';
import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

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
            icon: ShieldCheck,
        },
    ];

    const pillars = [
        {
            icon: Globe,
            title: 'Market access first',
            description: 'Helping Afghan producers reach global buyers with reliability and trust.',
        },
        {
            icon: ShieldCheck,
            title: 'Built for transparency',
            description: 'Keeping the model understandable so supporters can see how value is created.',
        },
        {
            icon: Heart,
            title: 'Reinvesting into care',
            description: 'Turning trade success into direct support for women-focused healthcare.',
        },
    ];

    return (
        <div className="bg-background text-foreground">
            <section className="section-padding bg-gradient-to-b from-background via-primary/5 to-background border-b border-border/60">
                <div className="container-custom space-y-8">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            About Afghanium
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            Mission-driven commerce
                        </Badge>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                        <div className="max-w-3xl">
                            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                Building a bridge from Afghan work to global opportunity.
                            </h1>
                            <p className="mt-5 text-lg leading-8 text-muted-foreground sm:text-xl">
                                Afghanium is a social enterprise that connects Afghan-made products to global customers and reinvests a portion of its success into direct humanitarian support.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {['Trade with dignity', 'Women-focused healthcare', 'Transparent impact'].map((item) => (
                                    <div key={item} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
                                        <span className="h-2 w-2 rounded-full bg-primary" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Card className="rounded-[2rem] border-border/70 bg-card/95 shadow-xl backdrop-blur">
                            <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                    Field note
                                </CardDescription>
                                <CardTitle className="text-2xl">Why the model matters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <p className="text-sm leading-7 text-muted-foreground whitespace-pre-wrap">
                                    {missionDescription || t('about.mission.description')}
                                </p>

                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Core promise</p>
                                    <p className="mt-2 text-base font-semibold text-foreground">Trade should create dignity, and profit should create responsibility.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-background">
                <div className="container-custom space-y-10">
                    <SectionTitle
                        title={t('about.values.title')}
                        subtitle={t('about.values.subtitle')}
                    />

                    <div className="grid gap-6 lg:grid-cols-2">
                        {[mission, vision].map((item) => {
                            const Icon = item.icon;

                            return (
                                <Card key={item.title} className="border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border/60">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                                    {item.title}
                                                </CardDescription>
                                                <CardTitle className="mt-2 text-2xl">{item.title}</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <p className="text-base leading-8 text-muted-foreground">{item.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section-padding bg-muted/30">
                <div className="container-custom">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <div className="max-w-3xl">
                            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                What we stand for
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-muted-foreground">
                                These principles shape how the brand operates, what it funds, and how we explain the work.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            {values.map((value) => {
                                const Icon = value.icon;

                                return (
                                    <Card key={value.title} className="border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                        <CardContent className="p-6">
                                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                                            <p className="mt-3 text-sm leading-7 text-muted-foreground">{value.description}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-background">
                <div className="container-custom">
                    <Card className="overflow-hidden rounded-[2rem] border-border/70 bg-card shadow-xl">
                        <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                            <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                How we operate
                            </CardDescription>
                            <CardTitle className="text-2xl">A practical model with two outcomes</CardTitle>
                        </CardHeader>

                        <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1fr]">
                            <div className="space-y-4 rounded-3xl border border-border bg-background p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <p className="font-semibold text-foreground">1. Trade products globally</p>
                                </div>
                                <p className="text-sm leading-7 text-muted-foreground">
                                    Afghan producers get market access for saffron, leather goods, rugs, gemstones, and other products with real demand.
                                </p>
                            </div>

                            <div className="space-y-4 rounded-3xl border border-border bg-background p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Heart className="h-5 w-5" />
                                    </div>
                                    <p className="font-semibold text-foreground">2. Reinvest into direct support</p>
                                </div>
                                <p className="text-sm leading-7 text-muted-foreground">
                                    A portion of profit supports women-focused healthcare projects, including women-only clinics staffed by women professionals.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="section-padding bg-gradient-to-br from-primary-dark to-primary text-white relative overflow-hidden">
                <div className="afghan-pattern-bg absolute inset-0 opacity-10" />
                <div className="container-custom relative z-10">
                    <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-md sm:p-12">
                        <Badge variant="secondary" className="mb-5 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            Join the mission
                        </Badge>
                        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Support the model that connects trade and care.
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
                            If you want to support the work directly, or learn more about how the model fits together, these are the next steps.
                        </p>

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Button asChild size="lg" className="rounded-full px-6 shadow-lg shadow-primary/20">
                                <Link to="/donate">Make a donation</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full px-6 !border-white !text-white hover:!bg-white hover:!text-primary">
                                <Link to="/contact">Contact us</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;