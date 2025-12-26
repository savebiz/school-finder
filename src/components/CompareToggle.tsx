import React from 'react';
import { useStore } from '@/store/useStore';
import { School } from '@/types';
import { Plus, Check } from 'lucide-react';

interface CompareToggleProps {
    school: School;
}

const CompareToggle: React.FC<CompareToggleProps> = ({ school }) => {
    const { compareList, toggleCompare } = useStore();
    const isSelected = compareList.some(s => s.id === school.id);

    return (
        <button
            onClick={(e) => {
                e.stopPropagation(); // Prevent card navigation
                toggleCompare(school);
            }}
            className={`flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isSelected
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50'
                }`}
        >
            {isSelected ? (
                <>
                    <Check className="w-3 h-3 mr-1" /> Added
                </>
            ) : (
                <>
                    <Plus className="w-3 h-3 mr-1" /> Compare
                </>
            )}
        </button>
    );
};

export default CompareToggle;
