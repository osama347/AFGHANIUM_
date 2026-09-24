import React from 'react';

const PageHero = ({ eyebrow, title, subtitle, children }) => (
    <section className="border-b border-border">
        <div className="container-custom py-16 sm:py-20 lg:py-24">
            <div className="max-w-2xl">
                {eyebrow && (
                    <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {eyebrow}
                    </p>
                )}
                <h1 className="font-display text-4xl font-bold leading-[0.98] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                        {subtitle}
                    </p>
                )}
                {children}
            </div>
        </div>
    </section>
);

export default PageHero;
