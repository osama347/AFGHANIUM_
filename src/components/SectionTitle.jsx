import React from 'react';

const SectionTitle = ({ eyebrow, title, subtitle, centered = true }) => {
    return (
        <div className={`mb-14 ${centered ? 'text-center' : ''}`}>
            {eyebrow && (
                <span className="eyebrow mb-3">{eyebrow}</span>
            )}
            <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                {title}
            </h2>
            {subtitle && (
                <p className={`mt-4 text-lg leading-relaxed text-muted-foreground ${centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default SectionTitle;
