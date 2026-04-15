import React from 'react';
import SectionTitle from '../components/SectionTitle';
import { ArrowRight, BookOpen, Heart, HeartHandshake, ShieldCheck, Target, Globe, Sparkles } from 'lucide-react';
import CTAButton from '../components/CTAButton';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

const ImpactStories = () => {
    const roadmapSections = [
        {
            title: 'Why We Exist',
            icon: Target,
            content: `Afghanistan is not lacking talent or quality—it is lacking access. Across the country, farmers, artists, and small producers create products that can compete globally, but many are blocked from international markets for practical reasons: limited export channels, difficult logistics, payment barriers, weak market visibility, and the absence of long-term trade relationships. The result is that exceptional Afghan products often remain trapped in local markets, sold below their true value, or never reach customers who would gladly buy them.

Afghanium is built to change that.

We create a bridge between Afghan producers and global customers—so Afghan-made work can be seen, trusted, purchased, and repeated at scale.`
        },
        {
            title: 'The Market Access Problem',
            icon: ArrowRight,
            content: `A clear example is Afghan saffron: it is frequently recognized for top-tier quality, yet many saffron farmers still struggle to reach consistent global demand due to market access and trade barriers. The same is true for other Afghan strengths—gemstones, handmade rugs, leather goods, and traditional arts—high-value products with limited pathways to international buyers.

Our goal is to turn that potential into real income and stability for producers by:
• Building reliable customer access abroad
• Improving visibility and trust through quality and transparency
• Ensuring trade is handled responsibly and legally`
        },
        {
            title: 'Why This Is Also Good Globally',
        icon: BookOpen,
        content: `Afghanium is not only good for Afghanistan. It also serves the international community by giving buyers in different parts of the world access to authentic Afghan products they often cannot find through normal retail channels.

This means consumers globally get trusted access to real Afghan quality, while their purchases directly support fair opportunity for Afghan producers.`
        },
        {
            title: 'Why We Also Invest in Healthcare',
            icon: Heart,
            content: `Afghanistan's medical sector faces ongoing strain and requires as much support as possible to deliver professional care—especially for women. In many contexts, healthcare remains one of the few sectors where women can still work and serve their communities. For that reason, Afghanium dedicates a portion of profit generated from trade to support women-focused healthcare initiatives, including women-only clinics staffed by women.

In short: we use trade to unlock Afghan potential—and we reinvest part of its success into women's healthcare.`
        }
    ];

    const keyPrinciples = [
        {
            icon: Globe,
            title: 'Market access',
            description: 'Opening practical channels so Afghan producers can reach buyers consistently.',
        },
        {
            icon: ShieldCheck,
            title: 'Trust and transparency',
            description: 'Keeping the model understandable, traceable, and credible from purchase to impact.',
        },
        {
            icon: HeartHandshake,
            title: 'Reinvestment into care',
            description: 'Converting trade success into direct support for women-focused healthcare initiatives.',
        },
    ];

    return (
        <div className="bg-background text-foreground">
            <section className="section-padding bg-gradient-to-b from-background via-primary/5 to-background">
                <div className="container-custom space-y-14">
                    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                        <div>
                            <Badge variant="secondary" className="mb-5 gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Mission and model
                            </Badge>

                            <SectionTitle
                                title="Why this project exists"
                                subtitle="The page is structured as a narrative: the problem, the bridge, and the reinvestment."
                                centered={false}
                            />

                            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                                Afghanium is a social enterprise built around one idea: if Afghan producers can reach the market fairly, the business model can also create room for direct humanitarian support.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {['Trade access', 'Women-focused healthcare', 'Transparent impact'].map((item) => (
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
                                    Core principles
                                </CardDescription>
                                <CardTitle className="text-2xl">A model designed to stay understandable</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                {keyPrinciples.map((principle) => {
                                    const Icon = principle.icon;

                                    return (
                                        <div key={principle.title} className="flex gap-4 rounded-2xl border border-border bg-background p-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{principle.title}</p>
                                                <p className="mt-1 text-sm leading-6 text-muted-foreground">{principle.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {[
                            { label: 'Trade model', value: 'Product-first' },
                            { label: 'Support channel', value: 'Direct donations' },
                            { label: 'Impact focus', value: 'Women and healthcare' },
                            { label: 'Operating style', value: 'Transparent and traceable' },
                        ].map((item) => (
                            <Card key={item.label} className="border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardContent className="p-6">
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
                                    <p className="mt-3 text-xl font-semibold text-foreground">{item.value}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {roadmapSections.map((section, index) => {
                            const Icon = section.icon;

                            return (
                                <Card key={section.title} className="overflow-hidden border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border/60">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                                    Section {index + 1}
                                                </CardDescription>
                                                <CardTitle className="mt-2 text-2xl">{section.title}</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <p className="whitespace-pre-wrap text-base leading-8 text-muted-foreground">
                                            {section.content}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <Card className="overflow-hidden rounded-[2rem] border-primary/10 bg-gradient-to-br from-primary-dark to-primary text-white shadow-2xl">
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
                                        Every purchase and donation strengthens the same bridge: better market access for Afghan work, and more support for direct impact where it matters.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:min-w-72">
                                    <CTAButton
                                        to="/donate"
                                        variant="gold"
                                        size="lg"
                                        className="inline-flex items-center justify-center gap-2"
                                    >
                                        Support our mission <ArrowRight className="h-4 w-4" />
                                    </CTAButton>
                                    <CTAButton
                                        to="/about"
                                        variant="outline"
                                        size="lg"
                                        className="inline-flex items-center justify-center gap-2 !text-white !border-white hover:!bg-white hover:!text-primary"
                                    >
                                        Learn more about us
                                    </CTAButton>
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
