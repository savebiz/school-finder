
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

    compareList: School[];
    toggleCompare: (school: School) => void;
    clearCompare: () => void;

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
    compareList: [],

    setSchools: (schools) => set({ schools, filteredSchools: schools }),

    toggleCompare: (school) => {
        const { compareList } = get();
        const exists = compareList.find(s => s.id === school.id);

        if (exists) {
            set({ compareList: compareList.filter(s => s.id !== school.id) });
        } else {
            if (compareList.length >= 3) {
                alert("You can only compare up to 3 schools.");
                return;
            }
            set({ compareList: [...compareList, school] });
        }
    },

    clearCompare: () => set({ compareList: [] }),

    setFilter: (key, value) => {
        set((state) => ({
            filters: { ...state.filters, [key]: value }
        }));
    },

    applyFilters: () => {
        const { schools, filters } = get();
        const filtered = schools.filter(school => {

            // Price Filter
            if (filters.minPrice !== null || filters.maxPrice !== null) {
                // Parse school price string e.g. "₦350,000 - ₦500,000" or "₦1,500,000+"
                const priceString = school.price_range.replace(/[^0-9\-\+]/g, '');
                let schoolMin = 0;
                let schoolMax = 0;

                if (priceString.includes('+')) {
                    schoolMin = parseInt(priceString.replace('+', ''));
                    schoolMax = Infinity;
                } else if (priceString.includes('-')) {
                    const parts = priceString.split('-');
                    schoolMin = parseInt(parts[0]);
                    schoolMax = parseInt(parts[1]);
                } else {
                    // Single value fallback
                    schoolMin = parseInt(priceString) || 0;
                    schoolMax = schoolMin;
                }

                if (filters.minPrice !== null && schoolMax < filters.minPrice) return false;
                if (filters.maxPrice !== null && schoolMin > filters.maxPrice) return false;
            }

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
