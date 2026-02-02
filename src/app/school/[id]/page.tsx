
'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { ArrowLeft, MapPin, CheckCircle, Phone, Mail, BookOpen, Layers, Sparkles, ChartBar, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SchoolDetail() {
    const params = useParams();
    const router = useRouter();
    const { schools } = useStore();
    const [activeLens, setActiveLens] = useState<'student' | 'parent'>('student');

    // params.id is string, school.id can be string or number
    const id = params?.id as string;
    const school = schools.find(s => s.id.toString() === id);

    if (!school) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">School not found</h2>
                    <button onClick={() => router.back()} className="mt-4 text-emerald-400 hover:underline">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-10 font-sans selection:bg-emerald-500/30">

            {/* Navigation & Lens Toggle */}
            <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-start pointer-events-none">
                <button
                    onClick={() => router.back()}
                    className="pointer-events-auto bg-black/20 hover:bg-white/10 backdrop-blur-xl text-white p-3 rounded-full transition-all border border-white/10 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* The Lens Switch */}
                <div className="pointer-events-auto glass-panel rounded-full p-1 flex items-center shadow-2xl">
                    <button
                        onClick={() => setActiveLens('student')}
                        className={`relative px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors ${activeLens === 'student' ? 'text-black' : 'text-white/50 hover:text-white'}`}
                    >
                        {activeLens === 'student' && (
                            <motion.div layoutId="lens-pill" className="absolute inset-0 bg-white rounded-full shadow-lg" />
                        )}
                        <span className="relative z-10 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Vibe</span>
                    </button>
                    <button
                        onClick={() => setActiveLens('parent')}
                        className={`relative px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors ${activeLens === 'parent' ? 'text-black' : 'text-white/50 hover:text-white'}`}
                    >
                        {activeLens === 'parent' && (
                            <motion.div layoutId="lens-pill" className="absolute inset-0 bg-white rounded-full shadow-lg" />
                        )}
                        <span className="relative z-10 flex items-center gap-1"><ChartBar className="w-3 h-3" /> Data</span>
                    </button>
                </div>

                <div className="w-10"></div> {/* Spacer for symmetry */}
            </div>

            {/* Immersive Header (Shared but adapts) */}
            <div className={`relative transition-all duration-700 ${activeLens === 'student' ? 'h-[80vh]' : 'h-[40vh]'}`}>
                {school.image ? (
                    <img src={school.image} alt={school.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-black to-black" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

                {/* School Title Overlay */}
                <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-4xl">
                    <motion.h1
                        layout
                        className="text-4xl md:text-7xl font-bold tracking-tighter mb-4 drop-shadow-2xl"
                    >
                        {school.name}
                    </motion.h1>
                    <motion.div layout className="flex items-center text-white/80 text-lg mb-6 backdrop-blur-sm bg-black/20 inline-flex px-3 py-1 rounded-lg">
                        <MapPin className="w-5 h-5 mr-2 text-emerald-400" />
                        <span>{school.address.street}, {school.address.lga}</span>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-10 -mt-10">
                <AnimatePresence mode="wait">

                    {/* STUDENT VIEW ---------------------------------------------- */}
                    {activeLens === 'student' && (
                        <motion.div
                            key="student"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-12 pb-24"
                        >
                            {/* Vibe Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl">
                                    <h3 className="text-white/50 uppercase tracking-widest text-sm font-bold mb-4">The Vibe</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(school.facilities || []).slice(0, 5).map(fac => (
                                            <span key={fac} className="px-4 py-2 bg-white/10 rounded-full text-white font-medium border border-white/5">
                                                ✨ {fac}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-emerald-500/10 backdrop-blur-3xl flex flex-col justify-center items-center text-center">
                                    <h3 className="text-emerald-400 uppercase tracking-widest text-sm font-bold mb-2">Social Rating</h3>
                                    <div className="text-6xl font-black text-white mb-2">{school.rating || '4.8'}</div>
                                    <div className="flex gap-1 text-emerald-400">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="fill-current w-5 h-5" />)}
                                    </div>
                                </div>
                            </div>

                            {/* "Stories" Row Placeholder */}
                            <div>
                                <h3 className="text-2xl font-bold mb-4">Highlights</h3>
                                <div className="flex overflow-x-auto gap-4 scrollbar-hide">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="min-w-[200px] h-[300px] bg-white/5 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    )}

                    {/* PARENT VIEW ---------------------------------------------- */}
                    {activeLens === 'parent' && (
                        <motion.div
                            key="parent"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-24"
                        >
                            <div className="md:col-span-2 space-y-6">
                                {/* Key Stats */}
                                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5">
                                    <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Academic Overview</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <StatBox label="Curriculum" value={school.curriculum?.join(', ')} />
                                        <StatBox label="Type" value={school.type} />
                                        <StatBox label="Est. Price" value={school.price_range} color="text-emerald-400" />
                                        <StatBox label="Grades" value="K-12" />
                                    </div>
                                </div>

                                {/* Detailed Table */}
                                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5">
                                    <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Tuition Breakdown</h3>
                                    <table className="w-full text-sm text-left text-white/70">
                                        <thead className="text-xs text-white/50 uppercase">
                                            <tr>
                                                <th className="py-3">Item</th>
                                                <th className="py-3">Term 1</th>
                                                <th className="py-3">Term 2</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-white/5">
                                                <td className="py-3 text-white">Tuition Fee</td>
                                                <td>₦150,000</td>
                                                <td>₦150,000</td>
                                            </tr>
                                            <tr className="border-b border-white/5">
                                                <td className="py-3 text-white">Development Levy</td>
                                                <td>₦20,000</td>
                                                <td>-</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 font-bold text-white">Total</td>
                                                <td className="font-bold text-emerald-400">₦170,000</td>
                                                <td className="font-bold text-emerald-400">₦150,000</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Contact Sidebar */}
                            <div className="space-y-6">
                                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5">
                                    <h3 className="text-lg font-bold mb-4">Contact Admissions</h3>
                                    <div className="space-y-4">
                                        <ContactRow icon={Phone} label="Phone" value={school.contact_info.phone} />
                                        <ContactRow icon={Mail} label="Email" value={school.contact_info.email || 'N/A'} />
                                    </div>
                                    <button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-emerald-900/50">
                                        Request Tour
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div >
    );
}

function StatBox({ label, value, color = "text-white" }: { label: string, value?: string, color?: string }) {
    return (
        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
            <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">{label}</div>
            <div className={`font-medium ${color}`}>{value || 'N/A'}</div>
        </div>
    )
}

function ContactRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <div className="text-xs text-white/40">{label}</div>
                <div className="text-sm font-medium text-white">{value}</div>
            </div>
        </div>
    )
}
