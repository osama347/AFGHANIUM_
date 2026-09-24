import React from 'react';

const SectionHeading = ({ index, title, subtitle, cta }) => (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
            <div className="flex items-baseline gap-3">
                {index && <span className="font-display text-sm font-bold text-primary">{index}</span>}
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
            </div>
            {subtitle && <p className="mt-2 max-w-xl text-muted-foreground">{subtitle}</p>}
        </div>
        {cta}
    </div>
);

export default SectionHeading;
