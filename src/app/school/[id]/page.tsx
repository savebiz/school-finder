
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { ArrowLeft, MapPin, CheckCircle, Phone, Mail, BookOpen, Layers } from 'lucide-react';

export default function SchoolDetail() {
    const params = useParams();
    const router = useRouter();
    const { schools } = useStore();

    // params.id is string, school.id is number
    const id = Number(params?.id);
    const school = schools.find(s => s.id === id);

    if (!school) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">School not found</h2>
                    <button onClick={() => router.back()} className="mt-4 text-emerald-600 hover:underline">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header Image / Pattern */}
            {/* Header Image / Pattern */}
            <div className="h-48 bg-emerald-700 relative">
                <div className="absolute top-0 left-0 w-full h-full">
                    {school.image ? (
                        <img src={school.image} alt={school.name} className="w-full h-full object-cover opacity-30" />
                    ) : (
                        <div className="w-full h-full bg-emerald-900/50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors backdrop-blur-sm z-10"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="absolute -bottom-10 left-4 md:left-10 bg-white p-4 rounded-xl shadow-md flex items-center z-10">
                    <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-bold text-2xl overflow-hidden">
                        {school.image ? (
                            <img src={school.image} alt={school.name} className="w-full h-full object-cover" />
                        ) : (
                            school.name.substring(0, 1)
                        )}
                    </div>
                    <div className="ml-4">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{school.name}</h1>
                        <div className="flex items-center text-gray-500 text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{school.address.street}, {school.address.lga}, {school.address.state}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-16 pt-4 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Overview Card */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Overview</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-xs text-gray-500 block">Type</span>
                                    <span className="font-medium text-gray-800">{school.type || 'N/A'}</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-xs text-gray-500 block">Price Range</span>
                                    <span className="font-medium text-emerald-600">{school.price_range || 'Contact for Price'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Facilities */}
                        {school.facilities && school.facilities.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <Layers className="w-5 h-5 mr-2 text-emerald-600" /> Facilities
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {school.facilities.map(fac => (
                                        <span key={fac} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-50 text-emerald-700">
                                            <CheckCircle className="w-3 h-3 mr-1" /> {fac}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tuition Breakdown (Mock) */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Tuition Breakdown</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Item</th>
                                            <th scope="col" className="px-6 py-3">Term 1</th>
                                            <th scope="col" className="px-6 py-3">Term 2</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">Tuition Fee</td>
                                            <td className="px-6 py-4">₦150,000</td>
                                            <td className="px-6 py-4">₦150,000</td>
                                        </tr>
                                        <tr className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">Development Levy</td>
                                            <td className="px-6 py-4">₦20,000</td>
                                            <td className="px-6 py-4">-</td>
                                        </tr>
                                        <tr className="bg-white hover:bg-gray-50">
                                            <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                                            <td className="px-6 py-4 font-bold text-emerald-600">₦170,000</td>
                                            <td className="px-6 py-4 font-bold text-emerald-600">₦150,000</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p className="text-xs text-gray-400 mt-2 italic">* Estimates based on class level.</p>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Contact */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h2>
                            <div className="space-y-4">
                                <a href={`tel:${school.contact_info.phone}`} className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                                        <Phone className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 block">Phone</span>
                                        <span className="font-medium">{school.contact_info.phone}</span>
                                    </div>
                                </a>
                                <a href={`mailto:${school.contact_info.email}`} className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 block">Email</span>
                                        <span className="font-medium bread-all">{school.contact_info.email}</span>
                                    </div>
                                </a>
                            </div>

                            <button className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition flex items-center justify-center shadow-lg shadow-emerald-200">
                                <MessageIcon className="w-5 h-5 mr-2" /> Chat on WhatsApp
                            </button>
                        </div>

                        {school.curriculum && school.curriculum.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2 text-emerald-600" /> Curriculum
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {school.curriculum.map(curr => (
                                        <span key={curr} className="inline-block px-3 py-1 bg-gray-100 rounded text-sm text-gray-700">
                                            {curr}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div >
    );
}

// Icon helper
function MessageIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
    )
}
