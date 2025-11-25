import React from 'react';

const Loader = ({ size = 'md', color = 'primary' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4',
    };

    const colorClasses = {
        primary: 'border-primary border-t-transparent',
        white: 'border-white border-t-transparent',
        secondary: 'border-secondary-dark border-t-transparent',
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
                role="status"
                aria-label="Loading"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
