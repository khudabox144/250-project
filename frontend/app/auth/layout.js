import React from 'react';

// This layout wraps the login and register pages, providing a consistent look.
export default function AuthLayout({ children }) {
  return (
    // Applied the blue sky gradient background
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-100 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-16 w-16 h-16 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      
      {/* Clouds */}
      <div className="absolute top-1/4 left-1/4 w-32 h-16 bg-white/70 rounded-full"></div>
      <div className="absolute top-1/3 right-1/4 w-40 h-20 bg-white/80 rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/3 w-36 h-18 bg-white/60 rounded-full"></div>
      
      {/* The 'children' will be the content of auth/login/page.js or auth/register/page.js */}
      {children}
    </div>
  );
}