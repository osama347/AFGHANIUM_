import React from 'react';

const SectionTitle = ({ title, subtitle, centered = true }) => {
    return (
        <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {subtitle}
                </p>
            )}
            <div className="mt-6 flex justify-center">
                <div className="w-24 h-1 bg-primary rounded-full" />
            </div>
        </div>
    );
};

export default SectionTitle;
