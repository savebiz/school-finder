
'use client';



import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SchoolCard from '@/components/SchoolCard';
import SchoolCardSkeleton from '@/components/SchoolCardSkeleton';
import FilterSidebar from '@/components/FilterSidebar';
import FilterChips from '@/components/FilterChips'; // We use this in the drawer head or separate
import CompareTray from '@/components/CompareTray';
import { useStore } from '@/store/useStore';
import { MapPin, Filter, Menu } from 'lucide-react';
import { motion, useAnimation, PanInfo, useDragControls } from 'framer-motion';

// Dynamic import for Map to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function Home() {
  const { filteredSchools, filters, setFilter, applyFilters } = useStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Animation controls for the drawer
  const controls = useAnimation();
  const dragControls = useDragControls();
  const [drawerState, setDrawerState] = useState<'collapsed' | 'half' | 'expanded'>('half');

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

  // Drag End Logic for Drawer
  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Determine direction and velocity
    const offset = info.offset.y;
    const velocity = info.velocity.y;

    if (velocity < -500 || offset < -100) {
      // Dragged Up fast or far
      if (drawerState === 'collapsed') {
        setDrawerState('half');
        controls.start({ y: '50vh' });
      } else {
        setDrawerState('expanded');
        controls.start({ y: '10vh' }); // Nearly full screen
      }
    } else if (velocity > 500 || offset > 100) {
      // Dragged Down fast or far
      if (drawerState === 'expanded') {
        setDrawerState('half');
        controls.start({ y: '50vh' });
      } else {
        setDrawerState('collapsed');
        controls.start({ y: '85vh' }); // Peek
      }
    } else {
      // Snap back to current state if drag wasn't significant
      const target = drawerState === 'expanded' ? '10vh' : drawerState === 'half' ? '50vh' : '85vh';
      controls.start({ y: target });
    }
  };

  // Initialize drawer position
  useEffect(() => {
    controls.start({ y: '50vh' });
  }, [controls]);


  return (
    <main className="flex h-screen w-screen overflow-hidden bg-gray-50 flex-col md:flex-row relative">

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 shadow-sm z-20 flex justify-between items-center safe-area-top">
        <h1 className="text-lg font-bold text-gray-900 flex items-center">
          <img src="/school-finder-logo.png" alt="SchoolFinder" className="h-12 w-auto" />
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
              <img src="/school-finder-logo.png" alt="SchoolFinder NG" className="h-20 w-auto" />
            </h1>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Toggle Filters"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
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

      {/* Mobile Bottom Drawer / List (Draggable) */}
      <motion.div
        animate={controls}
        initial={{ y: '50vh' }}
        drag="y"
        dragControls={dragControls}
        dragListener={false} // Disable global drag listener, only enable via controls
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={onDragEnd}
        className="md:hidden fixed top-0 left-0 right-0 h-[100vh] bg-white rounded-t-2xl shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.1)] z-10 flex flex-col"
        style={{ touchAction: 'none' }}
      >
        {/* Handle Bar */}
        <div
          className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
          onClick={() => {
            // Simple toggle logic on click if not dragging
            if (drawerState === 'collapsed') {
              setDrawerState('half');
              controls.start({ y: '50vh' });
            } else if (drawerState === 'half') {
              setDrawerState('expanded');
              controls.start({ y: '10vh' });
            } else {
              setDrawerState('half');
              controls.start({ y: '50vh' });
            }
          }}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <div className="px-4 py-2 border-b border-gray-100">
          <FilterChips onFilterChange={handleQuickFilter} activeFilters={filters} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-32">
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
      </motion.div>

      {/* Map View (Full screen on mobile) */}
      <div className="absolute inset-0 md:relative md:flex-1 h-full w-full z-0">
        <MapComponent schools={filteredSchools} center={mapCenter} />
      </div>

      <CompareTray />
    </main>
  );
}
