import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Scroll to top immediately
        window.scrollTo(0, 0);

        // Quick fade in
        const hideTimer = setTimeout(() => setIsVisible(false), 0);
        const showTimer = setTimeout(() => setIsVisible(true), 50);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(showTimer);
        };
    }, [location]);

    return (
        <div className={`transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {children}
        </div>
    );
};

export default PageTransition;
