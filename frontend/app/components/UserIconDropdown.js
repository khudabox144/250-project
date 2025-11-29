// components/UserIconDropdown.js
"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';

const UserIconDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    console.log('🔍 UserIconDropdown useEffect running...');
    
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    
    console.log('📦 localStorage user data:', userData);
    console.log('🔑 accessToken:', accessToken);
    console.log('🔍 All localStorage keys:', Object.keys(localStorage));
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('✅ Parsed user data:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('❌ Error parsing user info:', error);
      }
    } else {
      console.log('❌ No user data found in localStorage');
    }
    
    setLoading(false);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    setUser(null);
    setIsOpen(false);
    router.push('/');
  };

  // Show loading state
  if (loading) {
    return (
      <button className="p-2 border border-gray-300 rounded-full text-gray-600">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </button>
    );
  }

  // If user is not logged in, show login button
  if (!user) {
    console.log('👤 User is NOT logged in, showing login button');
    return (
      <Link href="/auth/login">
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
    );
  }

  console.log('👤 User IS logged in, showing dropdown for:', user);
  
  // If user is logged in, show dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 border border-gray-300 rounded-full text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors duration-200"
      >
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                {user.role && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="py-2">
            <Link 
            href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => { 
                
                 setIsOpen(false)
                }}
            >
              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </Link>
            
            <Link 
              href="/bookings" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Bookings
            </Link>
            
            <Link 
              href="/settings" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserIconDropdown;