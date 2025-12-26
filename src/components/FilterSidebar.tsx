
'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose }) => {
    // Mobile: Fixed position, sliding up/in. Desktop: Sticky sidebar.
    // For MVP we'll implement a simple sidebar structure.
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
        onClose(); // Optional: close on apply
    };

    return (
        <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl transform transition-all duration-300 ease-in-out h-screen overflow-y-auto border-r border-gray-200
            ${isOpen ? 'translate-x-0 w-80' : '-translate-x-full w-80'} 
            md:relative md:translate-x-0 md:shadow-none 
            ${isOpen ? 'md:w-80 md:opacity-100' : 'md:w-0 md:opacity-0 md:overflow-hidden'}
        `}>
            <div className="p-5">
                <div className="flex justify-between items-center mb-6 md:hidden">
                    <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Budget Range - Placeholder for MVP as string parsing is complex */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Budget Range</h3>
                        <div className="flex items-center space-x-2">

                            <input
                                type="number"
                                placeholder="Min"
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                value={filters.minPrice || ''}
                                onChange={(e) => setFilter('minPrice', e.target.value ? Number(e.target.value) : null)}
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                value={filters.maxPrice || ''}
                                onChange={(e) => setFilter('maxPrice', e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>
                    </div>

                    {/* Curriculum */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Curriculum</h3>
                        <div className="space-y-2">
                            {['British', 'American', 'Nigerian', 'Montessori', 'WAEC'].map((curr) => (
                                <label key={curr} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                        checked={filters.curriculum.includes(curr)}
                                        onChange={() => handleCheckboxChange('curriculum', curr)}
                                    />
                                    <span className="text-gray-700 text-sm">{curr}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Type */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Type</h3>
                        <div className="space-y-2">
                            {['Day', 'Boarding'].map((type) => (
                                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                        checked={filters.type.includes(type)}
                                        onChange={() => handleCheckboxChange('type', type)}
                                    />
                                    <span className="text-gray-700 text-sm">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Infrastructure */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Infrastructure</h3>
                        <div className="space-y-2">
                            {['Generator/Solar', 'School Bus', 'CCTV', 'Fenced Compound'].map((fac) => (
                                <label key={fac} className="flex items-center justify-between cursor-pointer">
                                    <span className="text-gray-700 text-sm">{fac}</span>
                                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input
                                            type="checkbox"
                                            name="toggle"
                                            id={`toggle-${fac}`}
                                            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 peer checked:right-0 checked:border-emerald-500"
                                            checked={filters.infrastructure.includes(fac)}
                                            onChange={() => handleCheckboxChange('infrastructure', fac)}
                                        />
                                        <label htmlFor={`toggle-${fac}`} className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer peer-checked:bg-emerald-500"></label>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={resetFilters} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors shadow-sm">
                            Reset
                        </button>
                        <button onClick={handleApply} className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
