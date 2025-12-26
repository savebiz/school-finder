
import { create } from 'zustand';
import { School } from '@/types';


interface FilterState {
    minPrice: number | null;
    maxPrice: number | null;
    curriculum: string[];
    type: string[];
    infrastructure: string[];
    location: string[];
}

interface AppState {
    schools: School[];
    filteredSchools: School[];
    filters: FilterState;

    compareList: School[];
    toggleCompare: (school: School) => void;
    clearCompare: () => void;

    // API State
    isLoading: boolean;
    nextPageToken: string | null;
    fetchSchools: (isLoadMore?: boolean) => Promise<void>;

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
    infrastructure: [],
    location: []
};

export const useStore = create<AppState>((set, get) => ({
    schools: [],
    filteredSchools: [],
    filters: initialFilters,
    compareList: [],
    isLoading: false,
    nextPageToken: null,

    fetchSchools: async (isLoadMore = false) => {
        const { nextPageToken, schools } = get();
        if (isLoadMore && !nextPageToken) return;

        set({ isLoading: true });

        try {
            const params = new URLSearchParams();
            if (isLoadMore && nextPageToken) params.append('pagetoken', nextPageToken);

            const res = await fetch(`/api/places?${params.toString()}`);

            if (!res.ok) {
                throw new Error(`API returned ${res.status}`);
            }

            const data = await res.json();

            const newSchools = (data.results || []) as School[];

            set((state) => {
                const updatedSchools = isLoadMore ? [...state.schools, ...newSchools] : newSchools;
                return {
                    schools: updatedSchools,
                    filteredSchools: updatedSchools, // Note: This resets filters currently. In real app, re-apply filters.
                    nextPageToken: data.next_page_token,
                    isLoading: false
                };
            });

            // Re-apply filters after fetch
            get().applyFilters();

        } catch (error) {
            console.error("Failed to fetch schools:", error);
            set({ isLoading: false });
        }
    },

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
                if (!school.price_range) return false;

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
                if (!school.curriculum) return false;
                const hasCurriculum = filters.curriculum.some(c => school.curriculum!.includes(c));
                if (!hasCurriculum) return false;
            }

            // Type
            if (filters.type.length > 0) {
                if (!school.type) return false;
                const hasType = filters.type.some(t => school.type!.includes(t) || school.type === 'Day & Boarding');
                // Basic matching
                if (!hasType) return false;
            }

            // Infrastructure
            if (filters.infrastructure.length > 0) {
                if (!school.facilities) return false;
                const hasInfra = filters.infrastructure.every(i => school.facilities!.includes(i));
                if (!hasInfra) return false;
            }

            // Location (LGA)
            if (filters.location.length > 0) {
                // Check if school.address.lga matches any selected location
                const hasLocation = filters.location.includes(school.address.lga);
                if (!hasLocation) return false;
            }

            return true;
        });
        set({ filteredSchools: filtered });
    },

    resetFilters: () => set({ filters: initialFilters, filteredSchools: get().schools })
}));
