import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Globe, Heart, ShieldCheck, Target, TrendingUp, Users } from 'lucide-react';
import { getContent } from '../supabase/content';
import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

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
            <section className="border-b border-border">
                <div className="container-custom relative z-10 py-16 md:py-22 lg:py-28">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Building a bridge from Afghan work
                            <span className="block text-primary">to global opportunity.</span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                            Afghanium is a social enterprise that connects Afghan-made products to global customers and reinvests part of its success into direct humanitarian support.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {['Trade with dignity', 'Women-focused healthcare', 'Transparent impact'].map((item) => (
                                <div key={item} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="mx-auto max-w-4xl">
                        <Card className="border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                                    Field note
                                </CardDescription>
                                <CardTitle className="text-2xl">Why the model matters</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <p className="text-base leading-8 text-muted-foreground whitespace-pre-wrap">
                                    {missionDescription || t('about.mission.description')}
                                </p>
                            </CardContent>
                            <CardFooter className="border-t border-border/60">
                                <p className="text-sm font-medium text-foreground">
                                    Trade should create dignity, and profit should create responsibility.
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-muted/20">
                <div className="container-custom">
                    <div className="mb-8 text-center">
                        <Badge variant="secondary" className="mb-3 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                            Mission and vision
                        </Badge>
                        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                            {t('about.values.title')}
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                            {t('about.values.subtitle')}
                        </p>
                    </div>

                    <div className="mx-auto max-w-4xl">
                        <Tabs defaultValue="mission" className="w-full">
                            <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0">
                                <TabsTrigger value="mission" className="rounded-xl border border-border bg-background py-2 data-[state=active]:border-primary/40">
                                    Mission
                                </TabsTrigger>
                                <TabsTrigger value="vision" className="rounded-xl border border-border bg-background py-2 data-[state=active]:border-primary/40">
                                    Vision
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="mission" className="mt-5">
                                <Card className="border-border/70 shadow-sm">
                                    <CardHeader className="pb-3">
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <mission.icon className="h-5 w-5" />
                                        </div>
                                        <CardTitle>{mission.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <CardDescription className="text-base leading-8">{mission.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="vision" className="mt-5">
                                <Card className="border-border/70 shadow-sm">
                                    <CardHeader className="pb-3">
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <vision.icon className="h-5 w-5" />
                                        </div>
                                        <CardTitle>{vision.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <CardDescription className="text-base leading-8">{vision.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="mb-8 text-center">
                        <Badge variant="outline" className="mb-3 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                            What we stand for
                        </Badge>
                        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                            Principles that shape decisions
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {values.map((value) => {
                            const Icon = value.icon;

                            return (
                                <Card key={value.title} className="border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    <CardHeader className="pb-3">
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg">{value.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <CardDescription>{value.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section-padding bg-muted/20">
                <div className="container-custom">
                    <div className="mb-8 text-center">
                        <Badge variant="secondary" className="mb-3 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                            How we operate
                        </Badge>
                        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                            A practical model with two outcomes
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {pillars.map((pillar) => {
                            const Icon = pillar.icon;

                            return (
                                <Card key={pillar.title} className="border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <CardHeader className="pb-3">
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg">{pillar.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <CardDescription>{pillar.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-primary text-primary-foreground">
                <div className="container-custom py-16 text-center sm:py-20">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Support the model that connects trade and care.
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
                        Support the work directly, or get in touch to learn more.
                    </p>
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                        <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                            <Link to="/donate">Make a donation</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="!bg-transparent border-white text-white hover:bg-white hover:text-primary">
                            <Link to="/contact">Contact us</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
