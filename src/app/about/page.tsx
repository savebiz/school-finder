'use client';

import { motion } from 'framer-motion';
import { Sparkles, Map, ShieldCheck, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white pb-32">

            {/* Hero */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-black/50 to-black z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 animate-pulse-slow" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-20 text-center max-w-3xl px-6"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-panel border border-emerald-500/30 text-emerald-400 mb-8">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-bold tracking-widest uppercase">The Future of Education Finding</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                        Find the Perfect<br />Place to Grow
                    </h1>
                </motion.div>
            </div>

            {/* Mission Section */}
            <div className="max-w-5xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Map, title: "Spatial Discovery", desc: "Experience school hunting like never before with our immersive map-first interface." },
                        { icon: ShieldCheck, title: "Verified Data", desc: "We partner directly with institutions to ensure every piece of data is accurate and up-to-date." },
                        { icon: Users, title: "Dual Lens", desc: "Unique viewing modes for both Parents (Data) and Students (Vibe) to make informed decisions." }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="glass-panel p-8 rounded-3xl border border-white/10"
                        >
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-white/60 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Logo Section / Footer */}
            <div className="text-center py-24 border-t border-white/10">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20">
                    <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">SchoolFinder</h2>
                <p className="text-white/50">© 2026 SchoolFinder NG. All rights reserved.</p>
            </div>
        </div>
    );
}
