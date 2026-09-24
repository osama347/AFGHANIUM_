import React from 'react';
import { Quote } from 'lucide-react';
import { getTestimonialImageUrl } from '../supabase/storage';

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="relative bg-card rounded-2xl p-8 shadow-sm hover:shadow-lifted transition-all duration-300 hover:-translate-y-2 border border-border group">
            {/* Decorative top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent-gold to-transparent rounded-t-2xl transition-all duration-300" />

            <div className="flex items-center justify-center mb-6">
                <Quote className="w-10 h-10 text-primary opacity-30" />
            </div>

            <p className="text-foreground/80 text-base mb-6 text-center leading-relaxed">
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
                <p className="font-display font-semibold text-foreground text-lg">
                    {testimonial.name}
                </p>
                {testimonial.location && (
                    <p className="text-muted-foreground text-sm mt-1 flex items-center justify-center gap-1">
                        📍 {testimonial.location}
                    </p>
                )}
            </div>

            {testimonial.amount && (
                <div className="mt-6 pt-4 border-t border-border text-center">
                    <span className="inline-block bg-secondary/15 px-3 py-1 rounded-full text-secondary-foreground font-semibold text-sm">
                        Donated ${testimonial.amount}
                    </span>
                </div>
            )}
        </div>
    );
};

export default TestimonialCard;
