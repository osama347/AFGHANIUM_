import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, MessageCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

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
            <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-primary/5 to-background">
                <div className="absolute -left-20 top-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                <div className="container-custom relative z-10 py-16 md:py-22 lg:py-28">
                    <div className="mx-auto max-w-4xl text-center">
                        <Badge variant="secondary" className="mb-5 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            FAQ
                        </Badge>

                        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            {t('faqPage.title')}
                        </h1>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                            {t('faqPage.subtitle')}
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {['Clear guidance', 'Transparent process', 'Quick help'].map((item) => (
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
                <div className="container-custom max-w-6xl">
                    <div className="mb-8 grid gap-4 md:grid-cols-3">
                        {[
                            {
                                icon: HelpCircle,
                                title: 'Clear guidance',
                                description: 'Short answers for common questions.',
                            },
                            {
                                icon: ShieldCheck,
                                title: 'Transparency',
                                description: 'How donations, tracking, and impact updates work.',
                            },
                            {
                                icon: MessageCircle,
                                title: 'Need more help?',
                                description: 'Contact us if your question is not listed.',
                            },
                        ].map((item) => {
                            const Icon = item.icon;

                            return (
                                <Card key={item.title} className="border-border/70 shadow-sm">
                                    <CardHeader className="pb-3">
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <CardDescription>{item.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="mx-auto max-w-5xl space-y-4">
                        {faqs.map((faq, i) => (
                            <details
                                key={faq.q}
                                className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 open:shadow-lg"
                                open={i === 0}
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-b border-transparent px-6 py-5 text-left group-open:border-border/60">
                                    <h2 className="text-lg font-semibold text-foreground sm:text-xl">{faq.q}</h2>
                                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-open:rotate-45">
                                        +
                                    </span>
                                </summary>
                                <div className="px-6 pb-6 pt-4 text-base leading-8 text-muted-foreground">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>

                    <Card className="mx-auto mt-8 max-w-5xl border-border/70 bg-muted/20 shadow-sm">
                        <CardContent className="flex flex-col items-center justify-between gap-4 p-6 text-center sm:flex-row sm:text-left">
                            <div>
                                <p className="font-semibold text-foreground">Still have a question?</p>
                                <p className="text-sm text-muted-foreground">Our team can help with donation, tracking, and platform questions.</p>
                            </div>
                            <Button asChild className="rounded-full px-6">
                                <Link to="/contact">Contact support</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
