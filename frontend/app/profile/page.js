// app/profile/page.js
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('🔍 Profile page checking authentication...');
    
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    console.log('📦 Profile - user data:', userData);
    console.log('🔑 Profile - accessToken:', token);
    
    if (!userData || !token) {
      console.log('❌ Profile - No user data or token, redirecting to login');
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log('✅ Profile - User data parsed successfully:', parsedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error('❌ Profile - Error parsing user data:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ... rest of the profile component remains the same
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="text-sm text-gray-600">Name</label>
              <p className="font-medium text-gray-900">{user.name || 'Not provided'}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="text-sm text-gray-600">Email</label>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            
            {user.phone && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-sm text-gray-600">Phone</label>
                <p className="font-medium text-gray-900">{user.phone}</p>
              </div>
            )}
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="text-sm text-gray-600">Role</label>
              <p className="font-medium text-gray-900 capitalize">{user.role || 'user'}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="text-sm text-gray-600">User ID</label>
              <p className="font-medium text-gray-900 font-mono text-sm">{user._id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;