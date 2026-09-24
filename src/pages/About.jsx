import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContent } from '../supabase/content';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';

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
    };

    const vision = {
        title: t('about.vision.title'),
        description: t('about.vision.description'),
    };

    const values = [
        {
            title: t('about.values.dignity.title'),
            description: t('about.values.dignity.description'),
        },
        {
            title: t('about.values.womensHealth.title'),
            description: t('about.values.womensHealth.description'),
        },
        {
            title: t('about.values.transparency.title'),
            description: t('about.values.transparency.description'),
        },
        {
            title: t('about.values.quality.title'),
            description: t('about.values.quality.description'),
        },
    ];

    const pillars = [
        {
            title: 'Market access first',
            description: 'Helping Afghan producers reach global buyers with reliability and trust.',
        },
        {
            title: 'Built for transparency',
            description: 'Keeping the model understandable so supporters can see how value is created.',
        },
        {
            title: 'Reinvesting into care',
            description: 'Turning trade success into direct support for women-focused healthcare.',
        },
    ];

    return (
        <div className="bg-background text-foreground">
            <PageHero
                eyebrow="About Afghanium"
                title="Building a bridge from Afghan work to global opportunity."
                subtitle="Afghanium is a social enterprise that connects Afghan-made products to global customers and reinvests part of its success into direct humanitarian support."
            />

            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid gap-10 border border-border lg:grid-cols-[1fr_1.4fr]">
                        <div className="border-b border-border p-8 lg:border-b-0 lg:border-r">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Field note</p>
                            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">
                                Why the model matters
                            </h2>
                            <p className="mt-4 text-sm font-medium text-foreground">
                                Trade should create dignity, and profit should create responsibility.
                            </p>
                        </div>
                        <div className="p-8">
                            <p className="text-base leading-8 text-muted-foreground whitespace-pre-wrap">
                                {missionDescription || t('about.mission.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding border-t border-border bg-muted/30">
                <div className="container-custom">
                    <SectionHeading index="01" title={t('about.values.title')} subtitle={t('about.values.subtitle')} />

                    <div className="mx-auto max-w-3xl">
                        <Tabs defaultValue="mission" className="w-full">
                            <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0">
                                <TabsTrigger value="mission" className="rounded-md border border-border bg-background py-2 data-[state=active]:border-primary/40">
                                    Mission
                                </TabsTrigger>
                                <TabsTrigger value="vision" className="rounded-md border border-border bg-background py-2 data-[state=active]:border-primary/40">
                                    Vision
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="mission" className="mt-5">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle>{mission.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <CardDescription className="text-base leading-8">{mission.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="vision" className="mt-5">
                                <Card>
                                    <CardHeader className="pb-3">
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

            <section className="section-padding border-t border-border">
                <div className="container-custom">
                    <SectionHeading index="02" title="Principles that shape decisions" />

                    <div className="grid divide-y divide-border border-t border-border sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
                        {values.map((value) => (
                            <div key={value.title} className="p-6">
                                <h3 className="font-semibold text-foreground">{value.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding border-t border-border bg-muted/30">
                <div className="container-custom">
                    <SectionHeading index="03" title="A practical model with two outcomes" />

                    <div className="grid divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                        {pillars.map((pillar) => (
                            <div key={pillar.title} className="p-6">
                                <h3 className="font-semibold text-foreground">{pillar.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-primary text-primary-foreground">
                <div className="container-custom py-20 sm:py-28">
                    <div className="max-w-2xl">
                        <h2 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                            Support the model that connects trade and care.
                        </h2>
                        <p className="mt-4 text-lg text-primary-foreground/85">
                            Support the work directly, or get in touch to learn more.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                                <Link to="/donate">Make a donation</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="!bg-transparent border-white text-white hover:bg-white hover:text-primary">
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
