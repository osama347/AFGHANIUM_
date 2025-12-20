import React from 'react';
import { Quote } from 'lucide-react';
import { getTestimonialImageUrl } from '../supabase/storage';

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="bg-white rounded-lg p-8 shadow-soft card-hover">
            <div className="flex items-center justify-center mb-6">
                <Quote className="w-12 h-12 text-primary opacity-20" />
            </div>

            <p className="text-gray-700 text-lg mb-6 text-center italic">
                "{testimonial.message}"
            </p>

            <div className="text-center">
                {testimonial.image_url && (
                    <div className="mb-4">
                        <img
                            src={getTestimonialImageUrl(testimonial.image_url)}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover mx-auto"
                        />
                    </div>
                )}
                <p className="font-semibold text-gray-900 text-lg">
                    {testimonial.name}
                </p>
                {testimonial.location && (
                    <p className="text-gray-500 text-sm mt-1">
                        {testimonial.location}
                    </p>
                )}
            </div>

            {testimonial.amount && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                    <span className="text-primary font-semibold">
                        Donated ${testimonial.amount}
                    </span>
                </div>
            )}
        </div>
    );
};

export default TestimonialCard;
