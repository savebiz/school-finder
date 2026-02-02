
'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose }) => {
    const { filters, setFilter, applyFilters, resetFilters } = useStore();

    const handleCheckboxChange = (category: 'curriculum' | 'type' | 'infrastructure', value: string) => {
        const current = filters[category];
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];
        setFilter(category, updated);
    };

    const handleApply = () => {
        applyFilters();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-100%', opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-y-4 left-4 z-50 glass-panel rounded-3xl w-80 shadow-2xl overflow-hidden border border-white/10"
                >
                    <div className="h-full overflow-y-auto p-6 scrollbar-hide text-white">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Filters</h2>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Budget Range */}
                            <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/5">
                                <h3 className="text-xs font-bold text-white/60 mb-3 uppercase tracking-widest">Budget Range</h3>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                                        value={filters.minPrice || ''}
                                        onChange={(e) => setFilter('minPrice', e.target.value ? Number(e.target.value) : null)}
                                    />
                                    <span className="text-white/40">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                                        value={filters.maxPrice || ''}
                                        onChange={(e) => setFilter('maxPrice', e.target.value ? Number(e.target.value) : null)}
                                    />
                                </div>
                            </div>

                            {/* Curriculum */}
                            <div>
                                <h3 className="text-xs font-bold text-white/60 mb-3 uppercase tracking-widest">Curriculum</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {['British', 'American', 'Nigerian', 'Montessori', 'WAEC'].map((curr) => (
                                        <label key={curr} className="flex items-center space-x-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${filters.curriculum.includes(curr) ? 'bg-white border-white' : 'border-white/30 group-hover:border-white/60 bg-transparent'}`}>
                                                {filters.curriculum.includes(curr) && <div className="w-2.5 h-2.5 bg-black rounded-[1px]" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={filters.curriculum.includes(curr)}
                                                onChange={() => handleCheckboxChange('curriculum', curr)}
                                            />
                                            <span className="text-white/80 group-hover:text-white transition-colors text-sm font-medium">{curr}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Type */}
                            <div>
                                <h3 className="text-xs font-bold text-white/60 mb-3 uppercase tracking-widest">Type</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Day', 'Boarding'].map((type) => (
                                        <label key={type} className={`cursor-pointer px-4 py-2 rounded-lg border text-sm font-medium transition-all ${filters.type.includes(type) ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={filters.type.includes(type)}
                                                onChange={() => handleCheckboxChange('type', type)}
                                            />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <h3 className="text-xs font-bold text-white/60 mb-3 uppercase tracking-widest">Location</h3>
                                <div className="space-y-2">
                                    {['Ikeja', 'Lekki', 'Ikoyi', 'Victoria Island', 'Ajah', 'Yaba'].map((loc) => (
                                        <label key={loc} className="flex items-center space-x-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${filters.location && filters.location.includes(loc) ? 'bg-white border-white' : 'border-white/30 group-hover:border-white/60 bg-transparent'}`}>
                                                {filters.location && filters.location.includes(loc) && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={filters.location && filters.location.includes(loc)}
                                                onChange={() => {
                                                    const current = filters.location || [];
                                                    const updated = current.includes(loc) ? current.filter(i => i !== loc) : [...current, loc];
                                                    setFilter('location', updated);
                                                }}
                                            />
                                            <span className="text-white/80 group-hover:text-white transition-colors text-sm font-medium">{loc}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button onClick={resetFilters} className="flex-1 px-4 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
                                    Reset
                                </button>
                                <button onClick={handleApply} className="flex-1 px-4 py-3 rounded-xl font-bold bg-white text-black hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FilterSidebar;
