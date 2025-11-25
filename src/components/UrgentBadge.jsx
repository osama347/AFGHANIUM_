import React from 'react';
import { AlertTriangle } from 'lucide-react';

const UrgentBadge = ({ size = 'md', showIcon = true, className = '' }) => {
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base',
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    return (
        <div
            className={`
                inline-flex items-center gap-1.5 
                bg-red-600 text-white font-bold uppercase tracking-wider
                rounded-full urgent-badge
                ${sizeClasses[size]}
                ${className}
            `}
        >
            {showIcon && <AlertTriangle className={iconSizes[size]} />}
            <span>URGENT</span>
        </div>
    );
};

export default UrgentBadge;
