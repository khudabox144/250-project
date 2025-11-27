import Link from 'next/link';
import React from 'react';

const Navbar = () => {
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
              {/* Nav Links */}
              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
                <a
                  href="#spots"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  Destinations
                </a>
                <a
                  href="#world-tour"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  Adventure Styles
                </a>
                <a
                  href="#recommendation"
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 transform hover:scale-105"
                >
                  Tour Packages
                </a>
                <a
                  href="/allDestination"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  allDestination
                </a>
              </nav>

              {/* Right-side Actions */}
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="hidden lg:block text-sm font-semibold text-blue-600 hover:underline"
                >
                  admin
                </Link>
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
                <Link href="/auth" >
                  <button className="p-2 border border-gray-300 rounded-full text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors duration-200">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
    );
};

export default Navbar;