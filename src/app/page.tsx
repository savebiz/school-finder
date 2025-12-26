
'use client';


import React, { useState, useMemo, useEffect } from 'react';

import dynamic from 'next/dynamic';
import SchoolCard from '@/components/SchoolCard';
import SchoolCardSkeleton from '@/components/SchoolCardSkeleton';
import FilterSidebar from '@/components/FilterSidebar';
import FilterChips from '@/components/FilterChips'; // We use this in the drawer head or separate
import { useStore } from '@/store/useStore';
import { MapPin, Filter, Menu } from 'lucide-react';

// Dynamic import for Map to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function Home() {
  const { filteredSchools, filters, setFilter, applyFilters } = useStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate loading state for Skeletons demo
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate center based on schools or default to Lagos
  const mapCenter: [number, number] = useMemo(() => {
    if (filteredSchools.length > 0) {
      return [filteredSchools[0].coordinates.lat, filteredSchools[0].coordinates.lng];
    }
    return [6.5244, 3.3792]; // Default Lagos
  }, [filteredSchools]);

  // Handle Quick Filters form Chips
  const handleQuickFilter = (category: string, value: string | boolean) => {
    // Logic to toggle filter
    // For MVP just standard set logic similar to sidebar
    if (category === 'curriculum' || category === 'type' || category === 'infrastructure') {
      const current = filters[category as keyof typeof filters] as string[];
      // Check if array logic applies
      if (Array.isArray(current)) {
        const updated = current.includes(value as string)
          ? current.filter(item => item !== value)
          : [...current, value];
        setFilter(category as any, updated);
      }
    }
    // Apply immediately for chips
    setTimeout(() => applyFilters(), 0);
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-gray-50 flex-col md:flex-row relative">

      {/* 
        MOBILE LAYOUT STRATEGY: 
        1. Map is FULL SCREEN z-0.
        2. Drawer is fixed bottom z-10.
        3. Header is fixed top z-20.
      */}

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 shadow-sm z-20 flex justify-between items-center safe-area-top">
        <h1 className="text-lg font-bold text-gray-900 flex items-center">
          <MapPin className="w-5 h-5 mr-1 text-emerald-600" /> SchoolFinder
        </h1>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Sidebar (Modal on mobile, Sidebar in design) */}
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      {/* Desktop Sidebar (List View) */}
      <div className="hidden md:flex w-[400px] lg:w-[450px] flex-col h-full bg-white shadow-xl z-10 border-r border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center tracking-tight">
              <MapPin className="w-6 h-6 mr-2 text-emerald-600" /> SchoolFinder NG
            </h1>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Toggle Filters"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          {/* Quick Chips in Desktop Header */}
          <FilterChips onFilterChange={handleQuickFilter} activeFilters={filters} />

          <p className="text-xs text-gray-400 mt-2 font-medium uppercase tracking-wider">{filteredSchools.length} schools available</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <>
              {[1, 2, 3, 4].map(i => <SchoolCardSkeleton key={i} />)}
            </>
          ) : (
            <>
              {filteredSchools.map(school => (
                <div key={school.id} onClick={() => window.location.href = `/school/${school.id}`}>
                  <SchoolCard school={school} />
                </div>
              ))}
              {filteredSchools.length === 0 && (
                <div className="text-center py-20">
                  <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-gray-900 font-bold mb-1">No schools found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Bottom Drawer / List */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[50vh] bg-white rounded-t-2xl shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.1)] z-10 flex flex-col transition-transform duration-300 ease-in-out">
        {/* Handle Bar */}
        <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <div className="px-4 py-2 border-b border-gray-100">
          <FilterChips onFilterChange={handleQuickFilter} activeFilters={filters} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-20">
          {/* Added pb-20 to ensure last card isn't hidden behind safe area or browser chrome */}
          {loading ? (
            <>
              {[1, 2, 3].map(i => <SchoolCardSkeleton key={i} />)}
            </>
          ) : (
            filteredSchools.map(school => (
              <div key={school.id} onClick={() => window.location.href = `/school/${school.id}`}>
                <SchoolCard school={school} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map View (Full screen on mobile) */}
      <div className="absolute inset-0 md:relative md:flex-1 h-full w-full z-0">
        <MapComponent schools={filteredSchools} center={mapCenter} />
      </div>

    </main>
  );
}
