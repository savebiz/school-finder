
'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import SchoolCard from '@/components/SchoolCard';
import SchoolCardSkeleton from '@/components/SchoolCardSkeleton';
import FilterSidebar from '@/components/FilterSidebar';
import FilterChips from '@/components/FilterChips';
import CompareTray from '@/components/CompareTray';
import { useStore } from '@/store/useStore';
import { Filter, Search, Sparkles } from 'lucide-react';
import { motion, useAnimation, useDragControls } from 'framer-motion';

// Dynamic import for Map to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-black flex items-center justify-center text-white/50">Loading Map...</div>
});

export default function Home() {
  const { filteredSchools, filters, setFilter, applyFilters, fetchSchools, isLoading, nextPageToken, setSearchQuery } = useStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial Fetch
  useEffect(() => {
    fetchSchools();
    setLoading(false);
  }, [fetchSchools]);

  // Infinite Scroll
  const loaderRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && nextPageToken && !isLoading) {
        fetchSchools(true);
      }
    }, { rootMargin: "20px", threshold: 0.1 });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextPageToken, isLoading, fetchSchools]);

  // Calculate center based on schools or default to Lagos
  const mapCenter: [number, number] = useMemo(() => {
    if (filteredSchools.length > 0) {
      return [filteredSchools[0].coordinates.lat, filteredSchools[0].coordinates.lng];
    }
    return [6.5244, 3.3792]; // Default Lagos
  }, [filteredSchools]);

  // Handle Quick Filters form Chips
  const handleQuickFilter = (category: string, value: string | boolean) => {
    if (category === 'curriculum' || category === 'type' || category === 'infrastructure') {
      const current = filters[category as keyof typeof filters] as string[];
      if (Array.isArray(current)) {
        const updated = current.includes(value as string)
          ? current.filter(item => item !== value)
          : [...current, value];
        setFilter(category as any, updated);
      }
    }
    setTimeout(() => applyFilters(), 0);
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-black flex-col relative text-white">

      {/* Background Map Layer */}
      <div className="absolute inset-0 z-0">
        <MapComponent schools={filteredSchools} center={mapCenter} />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 map-vignette z-10" />
      </div>

      {/* Floating Header & Search */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start pointer-events-none">

        {/* Brand */}
        <div className="pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center border border-white/20 shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">SchoolFinder</h1>
              <p className="text-xs text-white/70 font-medium tracking-wide">Next Gen Discovery</p>
            </div>
          </motion.div>
        </div>

        {/* Floating Search Pill - Pro Max */}
        <div className="pointer-events-auto w-full max-w-xl mx-4 hidden md:block">
          <div className="glass-panel rounded-full p-2 flex items-center shadow-2xl overflow-hidden group focus-within:ring-2 ring-emerald-500/50 transition-all border border-white/10 bg-black/40 backdrop-blur-2xl">
            <Search className="w-5 h-5 text-white/50 ml-4" />
            <input
              type="text"
              placeholder="Search schools, area, or curriculum..."
              className="bg-transparent border-none text-white placeholder-white/50 focus:ring-0 w-full px-4 py-3 text-lg font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchQuery(e.currentTarget.value);
                  fetchSchools();
                }
              }}
              defaultValue={useStore.getState().searchQuery}
            />
            <button
              onClick={() => {
                fetchSchools();
              }}
              className="p-3 mr-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="pointer-events-auto md:hidden">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-12 h-12 rounded-full glass-panel border border-white/20 flex items-center justify-center text-white shadow-lg"
          >
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Filter Sidebar (Drawer) */}
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      {/* Floating School List (Desktop: Left Rail) */}
      <div className="absolute left-6 top-32 bottom-24 w-[400px] hidden md:flex flex-col z-10 pointer-events-none">
        {/* Glass Container */}
        <div className="flex-1 glass-panel rounded-3xl overflow-hidden pointer-events-auto flex flex-col border border-white/10 shadow-2xl">
          <div className="p-5 border-b border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Nearby Schools</h2>
              <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-white/70">{filteredSchools.length} FOUND</span>
            </div>
            <FilterChips onFilterChange={handleQuickFilter} activeFilters={filters} />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {loading && !isLoading ? (
              <>
                {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />)}
              </>
            ) : (
              <>
                {filteredSchools.map(school => (
                  <div key={school.id} onClick={() => window.location.href = `/school/${school.id}`}>
                    <SchoolCard school={school} />
                  </div>
                ))}

                {/* Load More */}
                <div ref={loaderRef} className="py-8 text-center">
                  {isLoading && <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet (Draggable) */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 h-[60vh] z-10 pointer-events-none">
        <div className="h-full w-full glass-panel rounded-t-3xl pointer-events-auto flex flex-col pt-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-2 mt-2" />
          <div className="px-4 py-2 overflow-x-auto">
            <FilterChips onFilterChange={handleQuickFilter} activeFilters={filters} />
          </div>

          <div className="flex-1 overflow-y-auto p-4 pb-24">
            {filteredSchools.map(school => (
              <div key={school.id} onClick={() => window.location.href = `/school/${school.id}`}>
                <SchoolCard school={school} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <CompareTray />
    </main>
  );
}
