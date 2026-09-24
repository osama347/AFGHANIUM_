import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/Button';
import PageHero from '../components/PageHero';

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
            <PageHero eyebrow="FAQ" title={t('faqPage.title')} subtitle={t('faqPage.subtitle')} />

            <section className="section-padding">
                <div className="container-custom max-w-4xl">
                    <div className="space-y-px border border-border bg-border">
                        {faqs.map((faq, i) => (
                            <details
                                key={faq.q}
                                className="group bg-card"
                                open={i === 0}
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left">
                                    <h2 className="text-base font-semibold text-foreground sm:text-lg">{faq.q}</h2>
                                    <span className="shrink-0 text-xl font-light text-primary transition-transform duration-200 group-open:rotate-45">
                                        +
                                    </span>
                                </summary>
                                <div className="px-6 pb-6 text-base leading-8 text-muted-foreground">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-col items-start justify-between gap-4 border border-border p-6 sm:flex-row sm:items-center">
                        <div>
                            <p className="font-semibold text-foreground">Still have a question?</p>
                            <p className="mt-1 text-sm text-muted-foreground">Our team can help with donation, tracking, and platform questions.</p>
                        </div>
                        <Button asChild>
                            <Link to="/contact">Contact support</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
