
import React, { useRef, useState } from 'react';
import { MapPin, ShieldCheck, Zap, MessageCircle, Heart } from 'lucide-react';
import { School } from '@/types';
import CompareToggle from './CompareToggle';
import StarRating from './StarRating';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

interface SchoolCardProps {
  school: any;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school }) => {
  const { toggleFavorite, favorites } = useStore();
  const isFavorite = favorites.some(s => s.id === school.id);
  const imageUrl = school.image || `https://placehold.co/600x400/e2e8f0/475569?text=${encodeURIComponent(school.name)}`;

  // 3D Tilt Logic
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    setRotateX(yPct * -20); // Tilt amount
    setRotateY(xPct * 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY
      }}
      initial={{ scale: 1, opacity: 0.9 }}
      whileHover={{ scale: 1.02, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-panel rounded-2xl p-0 mb-6 relative group border border-white/10"
    >
      {/* 3D Depth Content Layer */}
      <div style={{ transform: "translateZ(20px)" }} className="relative">

        {/* Image Container */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
          <img
            src={imageUrl}
            alt={school.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

          {/* Verified Badge */}
          {school.verified && (
            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-emerald-300 px-2 py-1 rounded-full text-xs font-bold flex items-center border border-white/10 shadow-lg">
              <ShieldCheck className="w-3 h-3 mr-1 fill-current" /> Verified
            </div>
          )}

          {/* Price Tag */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium border border-white/10">
            {school.price_range}
          </div>

          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(school);
              }}
              className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${isFavorite ? 'bg-red-500 text-white border-red-400' : 'bg-black/40 text-white/70 border-white/10 hover:bg-white/20'}`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <CompareToggle school={school} />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 text-white">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl leading-tight tracking-tight drop-shadow-md">{school.name}</h3>
          </div>

          <div className="flex items-center text-gray-300 text-xs mb-4">
            <MapPin className="w-3 h-3 mr-1 text-emerald-400" />
            <span>{school.address.lga}, {school.address.state}</span>
          </div>

          {/* Facilities / Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {school.facilities.includes('Generator/Solar') && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-amber-500/20 text-amber-200 border border-amber-500/30">
                <Zap className="w-3 h-3 mr-1" /> Solar
              </span>
            )}
            <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-200 border border-blue-500/30">
              {school.type}
            </span>
          </div>

          {/* Footer: Rating & Action */}
          <div className="mt-2 flex items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-white leading-none">{school.rating || 'N/A'}</span>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Rating</span>
              </div>
              <StarRating rating={school.rating || 0} size={14} />
            </div>

            <a
              href={`https://wa.me/${school.contact_info.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center group/btn"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Chat
            </a>
          </div>
        </div>
      </div>

      {/* Glare Effect */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{ transform: "translateZ(30px)" }}
      />
    </motion.div>
  );
};

export default SchoolCard;
