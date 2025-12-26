
import { create } from 'zustand';
import { School } from '@/types';
import schoolsData from '@/data/schools.json';


interface FilterState {
    minPrice: number | null;
    maxPrice: number | null;
    curriculum: string[];
    type: string[];
    infrastructure: string[];
}

interface AppState {
    schools: School[];
    filteredSchools: School[];
    filters: FilterState;

    setSchools: (schools: School[]) => void;
    setFilter: (key: keyof FilterState, value: any) => void;
    applyFilters: () => void;
    resetFilters: () => void;
}

const initialFilters: FilterState = {
    minPrice: null,
    maxPrice: null,
    curriculum: [],
    type: [],
    infrastructure: []
};

export const useStore = create<AppState>((set, get) => ({
    schools: schoolsData as School[],
    filteredSchools: schoolsData as School[],
    filters: initialFilters,

    setSchools: (schools) => set({ schools, filteredSchools: schools }),

    setFilter: (key, value) => {
        set((state) => ({
            filters: { ...state.filters, [key]: value }
        }));
    },

    applyFilters: () => {
        const { schools, filters } = get();
        const filtered = schools.filter(school => {
            // Price Parsing (Simple implementation assuming "Nxx - Nyy")
            // In real app, school.price_range should be numerical or structured.
            // Skipping strict price filter for MVP with string ranges, strictly implementing others.

            // Curriculum
            if (filters.curriculum.length > 0) {
                const hasCurriculum = filters.curriculum.some(c => school.curriculum.includes(c));
                if (!hasCurriculum) return false;
            }

            // Type
            if (filters.type.length > 0) {
                const hasType = filters.type.some(t => school.type.includes(t) || school.type === 'Day & Boarding');
                // Basic matching
                if (!hasType) return false;
            }

            // Infrastructure
            if (filters.infrastructure.length > 0) {
                const hasInfra = filters.infrastructure.every(i => school.facilities.includes(i));
                // Strict match: must have ALL selected infrastructure? Or ANY?
                // Usually features are "Must have". Let's do ANY for now or ALL? "Every" is stricter.
                // Let's do "every" selected facility properly.
                if (!hasInfra) return false;
            }

            return true;
        });
        set({ filteredSchools: filtered });
    },

    resetFilters: () => set({ filters: initialFilters, filteredSchools: get().schools })
}));
