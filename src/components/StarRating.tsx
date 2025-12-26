import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    color?: string;
    size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, color = "text-yellow-400", size = 16 }) => {
    // Ensure rating is between 0 and 5
    const clampedRating = Math.min(Math.max(rating, 0), 5);
    const percentage = (clampedRating / 5) * 100;

    return (
        <div className="relative inline-block" title={`${clampedRating} out of 5`}>
            {/* Background Stars (Empty/Gray) */}
            <div className="flex text-gray-200">
                {[...Array(5)].map((_, i) => (
                    <Star key={`bg-${i}`} size={size} fill="currentColor" className="text-gray-200" strokeWidth={0} />
                ))}
            </div>

            {/* Foreground Stars (Filled/Colored) - Overlay with clip-path */}
            <div
                className="absolute top-0 left-0 flex transition-all duration-500 ease-out"
                style={{
                    clipPath: `inset(0 ${100 - percentage}% 0 0)`
                }}
            >
                <div className={`flex ${color}`}>
                    {[...Array(5)].map((_, i) => (
                        <Star key={`fg-${i}`} size={size} fill="currentColor" strokeWidth={0} />
                    ))}
                </div>
            </div>

            {/* Outlines (Optional, for crispness) */}
            <div className="absolute top-0 left-0 flex pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <Star key={`outline-${i}`} size={size} className="text-gray-300" strokeWidth={1} />
                ))}
            </div>
        </div>
    );
};

export default StarRating;
