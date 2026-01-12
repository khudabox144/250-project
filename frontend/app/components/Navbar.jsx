"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import UserIconDropdown from './UserIconDropdown';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            if (raw) setUser(JSON.parse(raw));
        } catch (e) {
            setUser(null);
        }
    }, []);

    const isVendor = user?.role === 'vendor' || user?.role === 'admin';

    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <Link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />

            <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg font-[Poppins]">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-4">
                            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-white hover:opacity-90">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <Link href="/" className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                Explore Bangladesh
                            </Link>
                        </div>

                        {/* Desktop Links */}
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white">
                            <Link href="/packages" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition">
                                Tour Packages
                            </Link>
                            <Link href="/allDestination" className="hover:underline">Destinations</Link>
                            <Link href="/services" className="hover:underline">Services</Link>

                            {isVendor && (
                                <>
                                    <Link href="/addPackage" className="hover:underline">Add Package</Link>
                                    <Link href="/addPlaces" className="hover:underline">Add Place</Link>
                                    <Link href="/vendor/bookings" className="px-3 py-1 bg-yellow-400 text-black rounded hover:brightness-95">Requests</Link>
                                </>
                            )}

                            {!isVendor && (
                                <Link href="/allDestination" className="hover:underline">Adventure Styles</Link>
                            )}
                        </nav>

                        {/* Right-side */}
                        <div className="flex items-center gap-4">
                            <div className="hidden md:block">
                                <UserIconDropdown />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden bg-white/10 backdrop-blur-sm py-4">
                        <div className="px-4 space-y-3">
                            <Link href="/packages" className="block text-white font-semibold">Tour Packages</Link>
                            <Link href="/allDestination" className="block text-white">Destinations</Link>
                            <Link href="/services" className="block text-white">Services</Link>
                            {isVendor && (
                                <>
                                    <Link href="/addPackage" className="block text-white">Add Package</Link>
                                    <Link href="/addPlaces" className="block text-white">Add Place</Link>
                                    <Link href="/vendor/bookings" className="block text-yellow-200 font-semibold">Requests</Link>
                                </>
                            )}
                            {!isVendor && (
                                <Link href="/allDestination" className="block text-white">Adventure Styles</Link>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Navbar;