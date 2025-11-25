import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingBar = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, [location]);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-200">
            <div className="h-full bg-gradient-to-r from-primary via-accent-gold to-primary animate-loading-bar shadow-lg"></div>
        </div>
    );
};

export default LoadingBar;
