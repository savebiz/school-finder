
import React from 'react';
import { MapPin, ShieldCheck, Zap, MessageCircle } from 'lucide-react';
import { School } from '@/types';

interface SchoolCardProps {
  school: any;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school }) => {
  // Safe Image Placeholder (using a reliable gradient or abstract pattern if real image missing)
  // For MVP "Apple-esque" feel, let's use a nice colored placeholder or random unsplash architecture if allowed.
  // Using a solid colorful div for now to ensure no broken images, or a sample URL.
  // Use school.image if available, otherwise fallback to placeholder
  const imageUrl = school.image || `https://placehold.co/600x400/e2e8f0/475569?text=${encodeURIComponent(school.name)}`;

  return (
    <div className="bg-white rounded-xl shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all duration-300 cursor-pointer mb-4 overflow-hidden border border-gray-100 group">

      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={school.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Verified Badge Overlay */}
        {school.verified && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-600 px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
            <ShieldCheck className="w-3 h-3 mr-1 fill-current" /> Verified
          </div>
        )}

        {/* Price Tag Overlay (Optional, but looks nice on image) */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium">
          {school.price_range}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">{school.name}</h3>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          <span className="truncate">{school.address.lga}, {school.address.state}</span>
        </div>

        {/* Facilities / Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {school.facilities.includes('Generator/Solar') && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-amber-50 text-amber-700">
              <Zap className="w-3 h-3 mr-1" /> Solar
            </span>
          )}
          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-slate-50 text-slate-600 border border-slate-100">
            {school.type}
          </span>
          {/* Limit to 2 badges to keep it clean, or generic '+2' */}
          {school.facilities.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-gray-50 text-gray-500">
              +{school.facilities.length - 1} more
            </span>
          )}
        </div>

        {/* Primary Action */}
        <a
          href={`https://wa.me/${school.contact_info.phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()} // Prevent card click
          className="flex items-center justify-center w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg font-semibold transition-colors shadow-sm shadow-emerald-200 active:scale-95"
        >
          <MessageCircle className="w-4 h-4 mr-2 fill-current" />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default SchoolCard;
