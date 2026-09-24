import React from 'react';
import { MapPin, Quote } from 'lucide-react';
import { getTestimonialImageUrl } from '../supabase/storage';

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="bg-card rounded-lg p-8 border border-border">
            <Quote className="mb-4 h-6 w-6 text-primary/40" />

            <p className="text-foreground/80 text-base leading-relaxed">
                "{testimonial.message}"
            </p>

            <div className="mt-6 flex items-center gap-3">
                {testimonial.image_url && (
                    <img
                        src={getTestimonialImageUrl(testimonial.image_url)}
                        alt={testimonial.name}
                        className="h-11 w-11 rounded-full object-cover"
                    />
                )}
                <div>
                    <p className="font-semibold text-foreground text-sm">
                        {testimonial.name}
                    </p>
                    {testimonial.location && (
                        <p className="text-muted-foreground text-xs mt-0.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {testimonial.location}
                        </p>
                    )}
                </div>
                {testimonial.amount && (
                    <span className="ml-auto shrink-0 text-xs font-medium text-muted-foreground">
                        ${testimonial.amount}
                    </span>
                )}
            </div>
        </div>
    );
};

export default TestimonialCard;
