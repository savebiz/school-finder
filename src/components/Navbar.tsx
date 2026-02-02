"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Map, Heart, Settings } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Explore", href: "/explore", icon: Map },
        { name: "Mylist", href: "/mylist", icon: Heart },
        { name: "Info", href: "/about", icon: Settings },
    ];

    return (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="glass-panel rounded-full px-6 py-3 flex items-center space-x-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative p-3 rounded-full transition-all duration-300 group ${isActive ? "text-white" : "text-white/60 hover:text-white"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-white/20 rounded-full blur-md"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </span>

                            {/* Tooltip */}
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
