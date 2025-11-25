import React from 'react';
import Hero from '../components/Hero';
import { useLanguage } from '../contexts/LanguageContext';

const FAQ = () => {
    const { t } = useLanguage();
    const faqs = t('faqPage.list', { returnObjects: true }) || [];

    return (
        <div>
            <Hero
                title={t('faqPage.title')}
                subtitle={t('faqPage.subtitle')}
                backgroundImage="/FAQ.png"
            />

            <section className="section-padding bg-white">
                <div className="container-custom max-w-4xl">
                    <div className="space-y-6">
                        {Array.isArray(faqs) && faqs.map((faq, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h3>
                                <p className="text-gray-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
