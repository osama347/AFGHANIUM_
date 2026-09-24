import React from 'react';
import PageHero from '../components/PageHero';

const sections = [
    {
        title: 'Donations',
        body: 'All donations are final and non-refundable unless required by law.',
    },
    {
        title: 'Use of Funds',
        body: 'We commit to using donations transparently and in accordance with our stated mission.',
    },
    {
        title: 'Liability',
        body: 'Afghanium is not liable for any indirect or consequential damages arising from the use of our services.',
    },
];

const Terms = () => {
    return (
        <div>
            <PageHero title="Terms & Conditions" subtitle="Please read these terms carefully" />

            <section className="section-padding">
                <div className="container-custom max-w-3xl">
                    <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">
                        By using Afghanium's services, you agree to these terms and conditions.
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

export default Terms;
