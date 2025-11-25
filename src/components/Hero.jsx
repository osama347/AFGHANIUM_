import React from 'react';
import CTAButton from './CTAButton';

const Hero = ({ title, subtitle, ctaText, ctaLink, backgroundImage, overlay = true }) => {
    return (
        <div className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}

            {/* Fallback Gradient if no image */}
            {!backgroundImage && (
                <div className="absolute inset-0 hero-gradient" />
            )}

            {/* Overlay */}
            {overlay && (
                <div className="absolute inset-0 bg-black/30" />
            )}

            {/* Afghan Pattern Overlay */}
            <div className="absolute inset-0 afghan-pattern-bg opacity-10" />

            {/* Content */}
            <div className="container-custom relative z-10 text-center text-white px-4">
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 drop-shadow-lg leading-tight">
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto drop-shadow-md">
                        {subtitle}
                    </p>
                )}

                {ctaText && ctaLink && (
                    <CTAButton to={ctaLink} size="lg" variant="gold">
                        {ctaText}
                    </CTAButton>
                )}
            </div>
        </div>
    );
};

export default Hero;
