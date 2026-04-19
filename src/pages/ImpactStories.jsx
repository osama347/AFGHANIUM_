import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    BookOpen,
    Globe,
    Heart,
    HeartHandshake,
    ShieldCheck,
    Sparkles,
    Target,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

const ImpactStories = () => {
    const roadmapSections = [
        {
            id: 'exist',
            title: 'Why we exist',
            icon: Target,
            summary:
                'Afghan producers create high-value products but often lack practical market access.',
            points: [
                'Limited export channels and weak distribution links.',
                'Payment, logistics, and visibility barriers.',
                'Afghanium bridges producers with global buyers at scale.',
            ],
        },
        {
            id: 'market',
            title: 'The market-access problem',
            icon: ArrowRight,
            summary:
                'Products like saffron, rugs, leather, and gemstones are strong, but pathways to buyers are weak.',
            points: [
                'Build reliable customer access abroad.',
                'Improve trust through quality and transparent operations.',
                'Support legal, responsible trade execution.',
            ],
        },
        {
            id: 'global',
            title: 'Why this helps globally',
            icon: BookOpen,
            summary:
                'International buyers gain trusted access to authentic Afghan products often unavailable in standard retail channels.',
            points: [
                'Better access to authentic Afghan quality.',
                'Fairer opportunity and income for producers.',
                'A stronger long-term trade relationship model.',
            ],
        },
        {
            id: 'healthcare',
            title: 'Why we reinvest in healthcare',
            icon: Heart,
            summary:
                'Part of trade success is reinvested into women-focused healthcare support in Afghanistan.',
            points: [
                'Support women-only clinics staffed by women professionals.',
                'Strengthen practical healthcare capacity where needed most.',
                'Keep trade growth connected to real humanitarian outcomes.',
            ],
        },
    ];

    const keyPrinciples = [
        {
            icon: Globe,
            title: 'Market access',
            description: 'Open practical pathways so Afghan producers can reach buyers consistently.',
        },
        {
            icon: ShieldCheck,
            title: 'Trust and transparency',
            description: 'Keep operations clear, traceable, and credible from purchase to impact.',
        },
        {
            icon: HeartHandshake,
            title: 'Reinvestment into care',
            description: 'Convert trade momentum into direct support for women-focused healthcare.',
        },
    ];

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
                            Mission and model
                        </Badge>

                        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Why this project exists.
                            <span className="block text-primary">Trade that also creates care.</span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                            Afghanium is built around one clear approach: unlock fair market access for Afghan producers, then reinvest part of the success into direct humanitarian support.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Button asChild size="lg" className="h-12 rounded-full px-6">
                                <Link to="/shop">Explore products</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6">
                                <Link to="/donate">Support the mission</Link>
                            </Button>
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {['Trade access', 'Women-focused healthcare', 'Transparent impact'].map((item) => (
                                <div
                                    key={item}
                                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow-sm"
                                >
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
                    <div className="mb-8 text-center">
                        <Badge variant="secondary" className="mb-3 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                            Core principles
                        </Badge>
                        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                            A model designed to stay understandable
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {keyPrinciples.map((principle) => {
                            const Icon = principle.icon;

                            return (
                                <Card key={principle.title} className="border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <CardHeader className="pb-3">
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg">{principle.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <CardDescription>{principle.description}</CardDescription>
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
                            Roadmap
                        </Badge>
                        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                            The story in four checkpoints
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                            Read this page quickly with tabs instead of long blocks.
                        </p>
                    </div>

                    <Tabs defaultValue="exist" className="mx-auto w-full max-w-5xl">
                        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 md:grid-cols-4">
                            {roadmapSections.map((section) => (
                                <TabsTrigger
                                    key={section.id}
                                    value={section.id}
                                    className="rounded-xl border border-border bg-background py-2 text-xs data-[state=active]:border-primary/40"
                                >
                                    {section.title}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {roadmapSections.map((section) => {
                            const Icon = section.icon;

                            return (
                                <TabsContent key={section.id} value={section.id} className="mt-5">
                                    <Card className="border-border/70 shadow-sm">
                                        <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <CardDescription className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                                        Checkpoint
                                                    </CardDescription>
                                                    <CardTitle className="mt-1 text-2xl">{section.title}</CardTitle>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-5 p-6">
                                            <p className="text-base leading-8 text-muted-foreground">{section.summary}</p>
                                            <ul className="space-y-2">
                                                {section.points.map((point) => (
                                                    <li key={point} className="flex items-start gap-2 text-sm leading-7 text-muted-foreground">
                                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </div>
            </section>

            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {[
                            { label: 'Trade model', value: 'Product-first' },
                            { label: 'Support channel', value: 'Direct donations' },
                            { label: 'Impact focus', value: 'Women and healthcare' },
                            { label: 'Operating style', value: 'Transparent and traceable' },
                        ].map((item) => (
                            <Card key={item.label} className="border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardHeader className="pb-3">
                                    <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em]">{item.label}</CardDescription>
                                    <CardTitle className="text-xl">{item.value}</CardTitle>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding bg-gradient-to-br from-primary-dark to-primary text-white">
                <div className="container-custom">
                    <Card className="overflow-hidden rounded-[2rem] border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur">
                        <CardContent className="p-8 sm:p-10">
                            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                                <div>
                                    <Badge variant="secondary" className="mb-4 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                                        Join the mission
                                    </Badge>
                                    <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                        Support Afghan producers and women-focused healthcare.
                                    </h3>
                                    <p className="mt-4 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
                                        Every purchase and donation strengthens the same bridge: better market access for Afghan work, and stronger direct support where it matters.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:min-w-72">
                                    <Button asChild size="lg" className="h-12 rounded-full bg-white text-primary hover:bg-white/90">
                                        <Link to="/donate" className="inline-flex items-center justify-center gap-2">
                                            Support our mission <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white text-white hover:bg-white hover:text-primary">
                                        <Link to="/about">Learn more about us</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default ImpactStories;
