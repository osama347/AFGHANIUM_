import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { ChevronLeft, ChevronRight, Play, Maximize2 } from 'lucide-react';
import Modal from './Modal';

const ImpactCard = ({ impact }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    // Combine media array and legacy image_url if media is empty
    const mediaItems = impact.media && impact.media.length > 0
        ? impact.media
        : impact.image_url ? [impact.image_url] : [];

    const isVideo = (url) => {
        if (!url) return false;
        // Remove query parameters and hash for extension check
        const cleanUrl = url.split(/[?#]/)[0].toLowerCase();
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.qt', '.m4v'];
        return videoExtensions.some(ext => cleanUrl.endsWith(ext));
    };

    const nextSlide = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    };

    const prevSlide = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    };

    const nextModalSlide = (e) => {
        e?.stopPropagation();
        setModalIndex((prev) => (prev + 1) % mediaItems.length);
    };

    const prevModalSlide = (e) => {
        e?.stopPropagation();
        setModalIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    };

    // Base64 placeholder for broken images (light gray background with "Image Error" text)
    const ERROR_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%23666'%3EImage Error%3C/text%3E%3C/svg%3E";

    return (
        <>
            <div
                className="bg-white rounded-lg overflow-hidden shadow-md card-hover cursor-pointer group"
                onClick={() => setShowDetails(true)}
            >
                {/* Media Carousel (Preview) */}
                {mediaItems.length > 0 && (
                    <div className="relative h-64 bg-gray-100">
                        {isVideo(mediaItems[currentIndex]) ? (
                            <video
                                src={mediaItems[currentIndex]}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                            />
                        ) : (
                            <img
                                src={mediaItems[currentIndex]}
                                alt={impact.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = ERROR_PLACEHOLDER;
                                }}
                            />
                        )}

                        {/* Overlay for Click Hint */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 w-8 h-8 drop-shadow-lg transform scale-75 group-hover:scale-100 transition-all" />
                        </div>

                        {/* Cost Badge */}
                        <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full font-semibold z-10 shadow-sm">
                            {formatCurrency(impact.cost)}
                        </div>

                        {/* Navigation Arrows */}
                        {mediaItems.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Dots Indicator */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
                                    {mediaItems.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block px-3 py-1 bg-secondary text-primary-dark text-sm font-medium rounded-full">
                            {impact.department}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {impact.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                        {impact.description}
                    </p>

                    {impact.admin_comment && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 italic truncate">
                                "{impact.admin_comment}"
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Full Details Modal */}
            <Modal
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                title="Impact Details"
                size="xl"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Media Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
                            {mediaItems.length > 0 ? (
                                <>
                                    {isVideo(mediaItems[modalIndex]) ? (
                                        <video
                                            src={mediaItems[modalIndex]}
                                            className="w-full h-full object-contain"
                                            controls
                                            autoPlay
                                            muted
                                            playsInline
                                        />
                                    ) : (
                                        <img
                                            src={mediaItems[modalIndex]}
                                            alt={impact.title}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = ERROR_PLACEHOLDER;
                                            }}
                                        />
                                    )}

                                    {/* Modal Navigation */}
                                    {mediaItems.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevModalSlide}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-40"
                                            >
                                                <ChevronLeft className="w-8 h-8" />
                                            </button>
                                            <button
                                                onClick={nextModalSlide}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-40"
                                            >
                                                <ChevronRight className="w-8 h-8" />
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="text-white text-center p-4">
                                    <p className="text-lg font-semibold">No Media Available</p>
                                    <p className="text-sm text-gray-400">This impact proof has no images or videos.</p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {mediaItems.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {mediaItems.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setModalIndex(idx)}
                                        className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${idx === modalIndex ? 'border-primary ring-2 ring-primary/30' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        {isVideo(item) ? (
                                            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                                <Play className="w-8 h-8 text-white" />
                                            </div>
                                        ) : (
                                            <img
                                                src={item}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-4 py-1.5 bg-secondary text-primary-dark font-semibold rounded-full">
                                    {impact.department}
                                </span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatCurrency(impact.cost)}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                {impact.title}
                            </h2>
                            <div className="prose prose-lg text-gray-600 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                <p className="whitespace-pre-wrap">{impact.description}</p>
                            </div>
                        </div>

                        {impact.admin_comment && (
                            <div className="bg-gray-50 border-l-4 border-primary p-6 rounded-r-lg">
                                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                    Admin Comment
                                </h4>
                                <p className="text-gray-700 italic text-lg">
                                    "{impact.admin_comment}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ImpactCard;
