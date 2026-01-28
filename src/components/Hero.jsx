import React, { useState, useEffect } from 'react';
import CTAButton from './CTAButton';
import { getSlideshowImages } from '../supabase/content';

const Hero = ({ title, subtitle, ctaText, ctaLink, backgroundImages = [], overlay = true }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [images, setImages] = useState(backgroundImages.length > 0 ? backgroundImages : []);
    const [loading, setLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(new Set());

    // Preload images
    useEffect(() => {
        const preloadImages = () => {
            const promises = images.map((image) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        setImagesLoaded((prev) => new Set(prev).add(image));
                        resolve();
                    };
                    img.onerror = resolve; // Resolve even if image fails
                    img.src = image;
                });
            });

            Promise.all(promises).then(() => {
                setLoading(false);
            });
        };

        if (images.length > 0) {
            preloadImages();
        } else {
            setLoading(false);
        }
    }, [images]);

    // Fetch slideshow images from database
    useEffect(() => {
        const fetchImages = async () => {
            if (backgroundImages.length === 0) {
                const result = await getSlideshowImages();
                if (result.success) {
                    setImages(result.data);
                } else {
                    // Fallback to default images if database fetch fails
                    setImages([
                        '/cover-photo.png',
                        '/53406943284_7830e45eb9_o (1) (1).jpg',
                        '/pict_large.jpg',
                        '/rs4317_christian-jepsen-9661.webp'
                    ]);
                }
            }
        };

        fetchImages();
    }, [backgroundImages]);

    // Auto-slide functionality
    useEffect(() => {
        if (images.length === 0) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [images.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1F5130] to-[#3A9D58]">
            {/* Slideshow Background */}
            <div className="absolute inset-0">
                {loading ? (
                    // Skeleton Loader with animated shimmer
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1F5130] via-[#3A9D58] to-[#1F5130] bg-size-200 animate-shimmer" />
                ) : (
                    images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{ backgroundImage: `url(${image})` }}
                        />
                    ))
                )}
            </div>

            {/* Fallback Gradient if no images */}
            {!loading && images.length === 0 && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1F5130] to-[#3A9D58]" />
            )}

            {/* Overlay */}
            {overlay && (
                <div className="absolute inset-0 bg-black/30" />
            )}

            {/* Loading Indicator */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center">
                            <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Afghan Pattern Overlay */}
            <div className="absolute inset-0 afghan-pattern-bg opacity-10" />

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Previous slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Next slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Slide Indicators */}
            {!loading && images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? 'bg-white scale-125'
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

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
