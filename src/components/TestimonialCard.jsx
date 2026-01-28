import React from 'react';
import { Quote } from 'lucide-react';
import { getTestimonialImageUrl } from '../supabase/storage';

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group">
            {/* Decorative top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-transparent rounded-t-xl group-hover:via-primary transition-all duration-300" />
            
            <div className="flex items-center justify-center mb-6">
                <Quote className="w-10 h-10 text-primary opacity-30" />
            </div>

            <p className="text-gray-700 text-base mb-6 text-center leading-relaxed">
                "{testimonial.message}"
            </p>

            <div className="text-center">
                {testimonial.image_url && (
                    <div className="mb-4 inline-block">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light rounded-full blur-md opacity-30" />
                            <img
                                src={getTestimonialImageUrl(testimonial.image_url)}
                                alt={testimonial.name}
                                className="relative w-16 h-16 rounded-full object-cover border-2 border-white"
                            />
                        </div>
                    </div>
                )}
                <p className="font-semibold text-gray-900 text-lg">
                    {testimonial.name}
                </p>
                {testimonial.location && (
                    <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
                        📍 {testimonial.location}
                    </p>
                )}
            </div>

            {testimonial.amount && (
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <span className="inline-block bg-gradient-to-r from-primary/10 to-transparent px-3 py-1 rounded-full text-primary font-semibold text-sm">
                        Donated ${testimonial.amount}
                    </span>
                </div>
            )}
        </div>
    );
};

export default TestimonialCard;
