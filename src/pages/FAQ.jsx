import React from 'react';
import { HelpCircle, MessageCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';

const FAQ = () => {
    const { t } = useLanguage();
    const faqs = Array.from({ length: 8 }, (_, i) => ({
        q: t(`faqPage.list.${i}.q`),
        a: t(`faqPage.list.${i}.a`),
    })).filter((faq) => (
        faq.q
        && faq.a
        && !faq.q.startsWith('faqPage.list.')
        && !faq.a.startsWith('faqPage.list.')
    ));

    return (
        <div className="bg-background text-foreground">
            <section className="section-padding bg-gradient-to-b from-background via-primary/5 to-background border-b border-border/60">
                <div className="container-custom space-y-8">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            FAQ
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            Practical answers
                        </Badge>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                        <div className="space-y-5 max-w-3xl">
                            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                {t('faqPage.title')}
                            </h1>
                            <p className="text-lg leading-8 text-muted-foreground sm:text-xl">
                                {t('faqPage.subtitle')}
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                            {[
                                {
                                    icon: HelpCircle,
                                    title: 'Clear guidance',
                                    description: 'Short answers for the questions people ask most often.',
                                },
                                {
                                    icon: ShieldCheck,
                                    title: 'Transparency',
                                    description: 'How donations, tracking, and impact communication work.',
                                },
                                {
                                    icon: MessageCircle,
                                    title: 'Need more help?',
                                    description: 'Use the contact page if your question is not listed below.',
                                },
                            ].map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Card key={item.title} className="border-border/70 shadow-sm">
                                        <CardContent className="p-5">
                                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <h2 className="text-base font-semibold text-foreground">{item.title}</h2>
                                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-background">
                <div className="container-custom max-w-5xl">
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details
                                key={faq.q}
                                className="group rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 open:shadow-lg"
                                open={i === 0}
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left">
                                    <h2 className="text-lg font-semibold text-foreground sm:text-xl">{faq.q}</h2>
                                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-open:rotate-45">
                                        +
                                    </span>
                                </summary>
                                <div className="px-6 pb-6 pt-1 text-base leading-8 text-muted-foreground border-t border-border/60">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
