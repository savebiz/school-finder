'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import SchoolCard from '@/components/SchoolCard';
import { Heart } from 'lucide-react';

export default function MyListPage() {
    const { favorites } = useStore();

    return (
        <div className="min-h-screen bg-black text-white pb-32">

            {/* Header */}
            <div className="pt-24 px-6 md:px-12 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-500/20 rounded-2xl border border-red-500/30">
                            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                            My Shortlist
                        </h1>
                    </div>
                    <p className="text-lg text-white/60">
                        {favorites.length === 0
                            ? "You haven't saved any schools yet. Explore to add some!"
                            : `You have ${favorites.length} saved schools in your list.`}
                    </p>
                </motion.div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((school, index) => (
                    <motion.div
                        key={school.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <SchoolCard school={school} />
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {favorites.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <div className="w-24 h-24 mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Heart className="w-10 h-10 text-white/30" />
                    </div>
                    <p className="text-xl font-medium">Your list is empty</p>
                    <a href="/" className="mt-4 text-emerald-400 hover:underline">Go back home</a>
                </div>
            )}
        </div>
    );
}
