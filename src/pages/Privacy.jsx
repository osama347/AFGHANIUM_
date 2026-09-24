import React from 'react';
import PageHero from '../components/PageHero';

const sections = [
    {
        title: 'Information We Collect',
        body: 'We collect information you provide when making donations, including name, email, and payment details.',
    },
    {
        title: 'How We Use Your Information',
        body: 'Your information is used solely to process donations and provide you with updates on the impact of your contributions.',
    },
    {
        title: 'Data Security',
        body: 'We employ industry-standard security measures to protect your personal information.',
    },
];

const Privacy = () => {
    return (
        <div>
            <PageHero title="Privacy Policy" subtitle="How we protect your data" />

            <section className="section-padding">
                <div className="container-custom max-w-3xl">
                    <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">
                        At Afghanium, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
                    </p>

                    <div className="mt-10 divide-y divide-border border-t border-border">
                        {sections.map((section) => (
                            <div key={section.title} className="py-6">
                                <h2 className="font-display text-xl font-bold tracking-tight text-foreground">{section.title}</h2>
                                <p className="mt-2 text-base leading-8 text-muted-foreground">{section.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Privacy;
