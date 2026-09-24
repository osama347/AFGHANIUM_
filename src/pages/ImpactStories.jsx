import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    BookOpen,
    Globe,
    Heart,
    HeartHandshake,
    ShieldCheck,
    Target,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';

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
            <PageHero
                eyebrow="Impact roadmap"
                title="Why this project exists. Trade that also creates care."
                subtitle="Afghanium is built around one clear approach: unlock fair market access for Afghan producers, then reinvest part of the success into direct humanitarian support."
            >
                <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild size="lg">
                        <Link to="/shop">Explore products</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link to="/donate">Support the mission</Link>
                    </Button>
                </div>
            </PageHero>

            <section className="section-padding">
                <div className="container-custom">
                    <SectionHeading index="01" title="A model designed to stay understandable" />

                    <div className="grid divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                        {keyPrinciples.map((principle) => (
                            <div key={principle.title} className="p-6">
                                <h3 className="font-semibold text-foreground">{principle.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{principle.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding border-t border-border bg-muted/30">
                <div className="container-custom">
                    <SectionHeading index="02" title="The story in four checkpoints" subtitle="Read this page quickly with tabs instead of long blocks." />

                    <Tabs defaultValue="exist" className="w-full">
                        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 md:grid-cols-4">
                            {roadmapSections.map((section) => (
                                <TabsTrigger
                                    key={section.id}
                                    value={section.id}
                                    className="rounded-md border border-border bg-background py-2 text-xs data-[state=active]:border-primary/40"
                                >
                                    {section.title}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {roadmapSections.map((section) => (
                            <TabsContent key={section.id} value={section.id} className="mt-5">
                                <Card>
                                    <CardHeader className="border-b border-border">
                                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                                            Checkpoint
                                        </CardDescription>
                                        <CardTitle className="mt-1 text-2xl">{section.title}</CardTitle>
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
                        ))}
                    </Tabs>
                </div>
            </section>

            <section className="section-padding border-t border-border">
                <div className="container-custom">
                    <div className="grid grid-cols-2 divide-y divide-border border-t border-border lg:grid-cols-4 lg:divide-y-0 lg:divide-x">
                        {[
                            { label: 'Trade model', value: 'Product-first' },
                            { label: 'Support channel', value: 'Direct donations' },
                            { label: 'Impact focus', value: 'Women and healthcare' },
                            { label: 'Operating style', value: 'Transparent and traceable' },
                        ].map((item) => (
                            <div key={item.label} className="p-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{item.label}</p>
                                <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-primary text-primary-foreground">
                <div className="container-custom py-14 sm:py-16">
                    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Support Afghan producers and women-focused healthcare.
                            </h3>
                            <p className="mt-3 max-w-2xl text-primary-foreground/85">
                                Every purchase and donation strengthens the same bridge: better market access for Afghan work, and stronger direct support where it matters.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:min-w-64">
                            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                                <Link to="/donate">Support our mission</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="!bg-transparent border-white text-white hover:bg-white hover:text-primary">
                                <Link to="/about">Learn more about us</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ImpactStories;
