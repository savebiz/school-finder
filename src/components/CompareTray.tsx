import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { X, ArrowRight, Layers } from 'lucide-react';

const CompareTray: React.FC = () => {
    const { compareList, clearCompare, toggleCompare } = useStore();
    const router = useRouter();

    if (compareList.length === 0) return null;

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50">
            <div className="bg-emerald-900 text-white rounded-xl shadow-2xl p-4 flex flex-col gap-3 border border-emerald-800 animate-in slide-in-from-bottom-5 duration-300">
                <div className="flex justify-between items-center border-b border-emerald-800 pb-2">
                    <div className="flex items-center font-bold">
                        <Layers className="w-5 h-5 mr-2 text-emerald-400" />
                        Compare Schools ({compareList.length}/3)
                    </div>
                    <button
                        onClick={clearCompare}
                        className="text-emerald-400 hover:text-white text-xs uppercase font-bold tracking-wider"
                    >
                        Clear
                    </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-700">
                    {compareList.map(school => (
                        <div key={school.id} className="relative flex-shrink-0 w-16 h-16 rounded-lg bg-emerald-800 overflow-hidden border border-emerald-700 group">
                            {school.image ? (
                                <img src={school.image} alt={school.name} className="w-full h-full object-cover opacity-80" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-xl text-emerald-500">
                                    {school.name.substring(0, 1)}
                                </div>
                            )}
                            <button
                                onClick={() => toggleCompare(school)}
                                className="absolute top-0 right-0 bg-black/50 hover:bg-red-500 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {[...Array(3 - compareList.length)].map((_, i) => (
                        <div key={`placeholder-${i}`} className="flex-shrink-0 w-16 h-16 rounded-lg bg-emerald-950/50 border-2 border-dashed border-emerald-800 flex items-center justify-center text-emerald-800 text-xs text-center p-1">
                            Add School
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => router.push('/compare')}
                    disabled={compareList.length < 2}
                    className={`w-full py-3 rounded-lg font-bold flex items-center justify-center transition-all ${compareList.length < 2
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-900/50'
                        }`}
                >
                    Compare Now <ArrowRight className="w-4 h-4 ml-2" />
                </button>
            </div>
        </div>
    );
};

export default CompareTray;
