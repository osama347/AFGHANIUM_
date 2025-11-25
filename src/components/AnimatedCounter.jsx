import React, { useEffect, useRef, useState } from 'react';

const AnimatedCounter = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setHasAnimated(true);
                    animateCount();
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, [end]); // Re-run when 'end' value changes (data loads)

    const animateCount = () => {
        const startTime = Date.now();
        const endNum = typeof end === 'string' ? parseInt(end.replace(/,/g, '')) : end;

        const updateCount = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * endNum);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                setCount(endNum);
            }
        };

        requestAnimationFrame(updateCount);
    };

    const formatNumber = (num) => {
        return num.toLocaleString();
    };

    return (
        <div ref={countRef} className="text-4xl md:text-5xl font-bold">
            {prefix}{formatNumber(count)}{suffix}
        </div>
    );
};

export default AnimatedCounter;
