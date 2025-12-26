'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { ArrowLeft, Check, X, ShieldCheck, MapPin } from 'lucide-react';

export default function ComparePage() {
    const { compareList, clearCompare } = useStore();
    const router = useRouter();

    if (compareList.length === 0) {
        // Ideally redirect, but show empty state for safety
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">No schools selected</h2>
                <button onClick={() => router.push('/')} className="text-emerald-600 font-bold hover:underline">
                    Go back to search
                </button>
            </div>
        );
    }

    // Collect all distinct facilities to create rows
    const allFacilities = Array.from(new Set(compareList.flatMap(s => s.facilities))).sort();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => router.back()}
                            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="font-bold text-lg text-gray-900">Compare Schools</h1>
                    </div>
                    <button
                        onClick={() => { clearCompare(); router.push('/'); }}
                        className="text-sm text-red-500 font-medium hover:text-red-700"
                    >
                        Clear All
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 mt-8">
                <div className="overflow-x-auto pb-4">
                    <table className="w-full min-w-[600px] border-separate border-spacing-0">
                        <thead>
                            <tr>
                                <th className="sticky left-0 z-20 w-48 bg-gray-50 p-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-500">
                                    School
                                </th>
                                {compareList.map(school => (
                                    <th key={school.id} className="w-64 p-4 border-b border-gray-200 bg-white align-top">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 rounded-lg bg-emerald-100 overflow-hidden mb-3 border border-gray-100">
                                                {school.image ? (
                                                    <img src={school.image} alt={school.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-emerald-600">
                                                        {school.name.slice(0, 1)}
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-center leading-tight mb-1">{school.name}</h3>
                                            {school.verified && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 mb-2">
                                                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Price */}
                            <tr>
                                <td className="sticky left-0 z-10 bg-gray-50 p-4 border-b border-gray-100 font-medium text-gray-700 text-sm">
                                    Price Range
                                </td>
                                {compareList.map(school => (
                                    <td key={school.id} className="p-4 border-b border-gray-100 bg-white text-center text-emerald-600 font-bold">
                                        {school.price_range}
                                    </td>
                                ))}
                            </tr>

                            {/* Type */}
                            <tr>
                                <td className="sticky left-0 z-10 bg-gray-50 p-4 border-b border-gray-100 font-medium text-gray-700 text-sm">
                                    Type
                                </td>
                                {compareList.map(school => (
                                    <td key={school.id} className="p-4 border-b border-gray-100 bg-white text-center text-gray-600">
                                        {school.type}
                                    </td>
                                ))}
                            </tr>

                            {/* Location */}
                            <tr>
                                <td className="sticky left-0 z-10 bg-gray-50 p-4 border-b border-gray-100 font-medium text-gray-700 text-sm">
                                    Location
                                </td>
                                {compareList.map(school => (
                                    <td key={school.id} className="p-4 border-b border-gray-100 bg-white text-center text-gray-600 text-sm">
                                        <div className="flex items-center justify-center">
                                            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                            {school.address.lga}, {school.address.state}
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            {/* Curriculum */}
                            <tr>
                                <td className="sticky left-0 z-10 bg-gray-50 p-4 border-b border-gray-100 font-medium text-gray-700 text-sm">
                                    Curriculum
                                </td>
                                {compareList.map(school => (
                                    <td key={school.id} className="p-4 border-b border-gray-100 bg-white text-center">
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {school.curriculum.map(c => (
                                                <span key={c} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            {/* Facilities Separator */}
                            <tr>
                                <td colSpan={compareList.length + 1} className="bg-emerald-50/50 p-3 text-xs font-bold text-emerald-800 uppercase tracking-wider text-center">
                                    Facilities
                                </td>
                            </tr>

                            {/* Facility Rows */}
                            {allFacilities.map(facility => (
                                <tr key={facility}>
                                    <td className="sticky left-0 z-10 bg-gray-50 p-4 border-b border-gray-100 font-medium text-gray-700 text-sm">
                                        {facility}
                                    </td>
                                    {compareList.map(school => {
                                        const hasIt = school.facilities.includes(facility);
                                        return (
                                            <td key={`${school.id}-${facility}`} className="p-4 border-b border-gray-100 bg-white text-center">
                                                {hasIt ? (
                                                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                                ) : (
                                                    <span className="text-gray-300 mx-auto block max-w-fit">—</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
