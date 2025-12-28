import Link from 'next/link';
import React from 'react';
import UserIconDropdown from './UserIconDropdown';

const Navbar = () => {
    // This would typically come from your auth context or state management
    // For now, I'll show how to structure it. You'll need to replace this with your actual user data
    
    // Example user data structure (you'll get this from your auth system)
    const user = {
        isAuthenticated: true, // This would come from your auth context
        role: 'vendor', // 'admin', 'vendor', 'user', or null
        name: 'John Doe'
    };

    // You would typically get this from context like:
    // const { user } = useAuth();
    // or from localStorage:
    // const user = JSON.parse(localStorage.getItem('user'));

    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
            />
            <Link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />
            <header className="bg-white shadow-lg sticky top-0 z-50 font-[Poppins]">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link
                                href="/"
                                className="text-3xl font-bold text-blue-800 tracking-tight"
                            >
                                Explore Bangladesh
                            </Link>
                        </div>

                        {/* Navigation and Actions */}
                        <div className="flex items-center space-x-6">
                            {/* Nav Links - Conditionally rendered based on user role */}
                            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
                                {/* For Admin Users */}
                                {user?.role === 'admin' && (
                                    <>
                                        <Link
                                            href="/admin"
                                            className="hover:text-blue-600 transition-colors duration-200"
                                        >
                                            Admin Dashboard
                                        </Link>
                                        <Link
                                            href="/allDestination"
                                            className="hover:text-blue-600 transition-colors duration-200"
                                        >
                                            Destinations
                                        </Link>
                                    </>
                                )}

                                {/* For Vendor Users - ONLY VENDORS SEE THESE LINKS */}
                                {user?.role === 'vendor' && (
                                    <>
                                        <Link
                                            href="/addPackage"
                                            className="hover:text-blue-600 transition-colors duration-200"
                                        >
                                            Add Package
                                        </Link>
                                        <Link
                                            href="/addPlaces"
                                            className="hover:text-blue-600 transition-colors duration-200"
                                        >
                                            Add Tour Place
                                        </Link>
                                    </>
                                )}

                                {/* For Regular Users & Guests */}
                                {(!user?.role || user?.role === 'user') && (
                                    <>
                                        <Link
                                            href="/allDestination"
                                            className="hover:text-blue-600 transition-colors duration-200"
                                        >
                                            Destinations
                                        </Link>
                                        <Link
                                            href="#world-tour"
                                            className="hover:text-blue-600 transition-colors duration-200"
                                        >
                                            Adventure Styles
                                        </Link>
                                    </>
                                )}

                                {/* Common Links for All Users */}
                                <Link
                                    href="/packages"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 transform hover:scale-105"
                                >
                                    Tour Packages
                                </Link>
                                
                                {/* Additional common link */}
                                <Link
                                    href="/allDestination"
                                    className="hover:text-blue-600 transition-colors duration-200"
                                >
                                    All Destinations
                                </Link>
                            </nav>

                            {/* Right-side Actions */}
                            <div className="flex items-center space-x-4">
                                {/* Admin Link - Only show for admin users */}
                                {user?.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="hidden lg:block text-sm font-semibold text-blue-600 hover:underline"
                                    >
                                        Admin Panel
                                    </Link>
                                )}

                                {/* Vendor Dashboard Link - Only show for vendor users */}
                                {/* {user?.role === 'vendor' && (
                                    <Link
                                        href="/vendor/dashboard"
                                        className="hidden lg:block text-sm font-semibold text-blue-600 hover:underline"
                                    >
                                        Vendor Dashboard
                                    </Link>
                                )} */}

                                {/* Language Selector */}
                                <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4H6a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>EN</span>
                                </button>

                                {/* Favorites Button */}
                                <button className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                </button>
                                
                                {/* User Icon Dropdown - This should handle auth state */}
                                <UserIconDropdown />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;