
import React from 'react';

const SchoolCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4 opacity-75">
            {/* Image Skeleton */}
            <div className="w-full aspect-video bg-gray-200 animate-pulse"></div>

            <div className="p-4 space-y-3">
                {/* Title Skeleton */}
                <div className="h-6 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>

                {/* Location Skeleton */}
                <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>

                {/* Badges Skeleton */}
                <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                </div>

                {/* Button Skeleton */}
                <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse mt-4"></div>
            </div>
        </div>
    );
};

export default SchoolCardSkeleton;
