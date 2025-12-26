
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ChipProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={twMerge(
            "px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap border snap-center",
            isActive
                ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-105"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
        )}
    >
        {label}
    </button>
);

interface FilterChipsProps {
    onFilterChange: (category: string, value: string) => void;
    activeFilters: Record<string, any>;
}

// Quick filters data mapping
const QUICK_FILTERS = [
    { label: "Under ₦150k", category: "budget", value: "150k" },
    { label: "Boarding", category: "type", value: "Boarding" },
    { label: "British Curriculum", category: "curriculum", value: "British" },
    { label: "Solar Power", category: "infrastructure", value: "Generator/Solar" },
    { label: "Verified", category: "verified", value: true },
];

const FilterChips: React.FC<FilterChipsProps> = ({ onFilterChange, activeFilters }) => {
    return (
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex space-x-2 w-max">
                {QUICK_FILTERS.map((filter) => {
                    // Logic to determine if active is simplified for MVP demo
                    let isActive = false;
                    if (filter.category === 'curriculum') isActive = activeFilters.curriculum?.includes(filter.value);
                    else if (filter.category === 'type') isActive = activeFilters.type?.includes(filter.value);
                    else if (filter.category === 'infrastructure') isActive = activeFilters.infrastructure?.includes(filter.value);
                    // else if (filter.category === 'budget') ... complex

                    return (
                        <Chip
                            key={filter.label}
                            label={filter.label}
                            isActive={isActive}
                            onClick={() => onFilterChange(filter.category, filter.value as any)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default FilterChips;
