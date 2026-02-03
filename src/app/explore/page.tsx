'use client';

import { motion } from 'framer-motion';
import { Compass, Trophy, Activity, Wallet } from 'lucide-react';
import Navbar from '@/components/Navbar';

const collections = [
    {
        title: "Top Rated Schools",
        description: "The highest rated academic institutions in Lagos.",
        icon: Trophy,
        color: "bg-yellow-500/20 text-yellow-500",
        image: "https://images.unsplash.com/photo-1541339907198-e021fc2727ce?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Best for Sports",
        description: "Schools with Olympic-sized pools and vast fields.",
        icon: Activity,
        color: "bg-emerald-500/20 text-emerald-500",
        image: "https://images.unsplash.com/photo-1576678927484-9918154f4ea9?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Budget Friendly",
        description: "Quality education that doesn't break the bank.",
        icon: Wallet,
        color: "bg-blue-500/20 text-blue-500",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "STEM Focused",
        description: "Future-ready curriculum with robotics and coding.",
        icon: Compass,
        color: "bg-purple-500/20 text-purple-500",
        image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1000&auto=format&fit=crop"
    }
];

export default function ExplorePage() {
    return (
        <div className="min-h-screen bg-black text-white pb-32">

            {/* Header */}
            <div className="pt-24 px-6 md:px-12 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-white via-white/80 to-white/40 bg-clip-text text-transparent">
                        Discover Excellence
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Curated collections of the finest educational institutions, handpicked for your specific needs.
                    </p>
                </motion.div>
            </div>

            {/* Collections Grid */}
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {collections.map((collection, index) => (
                    <motion.div
                        key={collection.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-white/10"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={collection.image}
                                alt={collection.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <div className={`w-12 h-12 rounded-2xl ${collection.color} backdrop-blur-xl flex items-center justify-center mb-4 border border-white/10`}>
                                <collection.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{collection.title}</h3>
                            <p className="text-white/70 line-clamp-2">{collection.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Coming Soon Section */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto mt-24 text-center p-12 glass-panel rounded-3xl border border-white/10"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-emerald-400 mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    AI ADVISOR COMING SOON
                </div>
                <h2 className="text-3xl font-bold mb-4">Not sure where to start?</h2>
                <p className="text-white/60 mb-8">Our AI-powered consultant will soon be able to interview you and generate a personalized shortlist of schools.</p>
                <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
                    Join Waitlist
                </button>
            </motion.div>
        </div>
    );
}
