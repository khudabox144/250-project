// components/UserDropdown.js
"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Get user from localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }

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
    localStorage.removeItem('userInfo');
    localStorage.removeItem('accessToken');
    setUser(null);
    setIsOpen(false);
    router.push('/');
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link 
          href="/login" 
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          Login
        </Link>
        <Link 
          href="/register" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-gray-700 hidden sm:block">{user.name || 'User'}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          
          <Link 
            href="/profile" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            👤 My Profile
          </Link>
          
          <Link 
            href="/bookings" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            📋 My Bookings
          </Link>
          
          <Link 
            href="/settings" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            ⚙️ Settings
          </Link>

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;