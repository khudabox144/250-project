// // // app/profile/page.js
// // "use client";
// // import { useEffect, useState } from 'react';
// // import { useRouter } from 'next/navigation';

// // const UserProfile = () => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const router = useRouter();

// //   useEffect(() => {
// //     console.log('🔍 Profile page checking authentication...');
    
// //     const userData = localStorage.getItem('user');
// //     const token = localStorage.getItem('accessToken');
    
// //     console.log('📦 Profile - user data:', userData);
// //     console.log('🔑 Profile - accessToken:', token);
    
// //     if (!userData || !token) {
// //       console.log('❌ Profile - No user data or token, redirecting to login');
// //       router.push('/auth/login');
// //       return;
// //     }

// //     try {
// //       const parsedUser = JSON.parse(userData);
// //       console.log('✅ Profile - User data parsed successfully:', parsedUser);
// //       setUser(parsedUser);
// //     } catch (error) {
// //       console.error('❌ Profile - Error parsing user data:', error);
// //       router.push('/auth/login');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [router]);

// //   // ... rest of the profile component remains the same
// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Loading profile...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!user) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <div className="text-center">
// //           <div className="text-red-500 text-lg mb-4">User not found</div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-8">
// //       <div className="max-w-4xl mx-auto px-4">
// //         <div className="bg-white rounded-2xl shadow-lg p-6">
// //           <h1 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h1>
          
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div className="p-4 bg-gray-50 rounded-lg">
// //               <label className="text-sm text-gray-600">Name</label>
// //               <p className="font-medium text-gray-900">{user.name || 'Not provided'}</p>
// //             </div>
            
// //             <div className="p-4 bg-gray-50 rounded-lg">
// //               <label className="text-sm text-gray-600">Email</label>
// //               <p className="font-medium text-gray-900">{user.email}</p>
// //             </div>
            
// //             {user.phone && (
// //               <div className="p-4 bg-gray-50 rounded-lg">
// //                 <label className="text-sm text-gray-600">Phone</label>
// //                 <p className="font-medium text-gray-900">{user.phone}</p>
// //               </div>
// //             )}
            
// //             <div className="p-4 bg-gray-50 rounded-lg">
// //               <label className="text-sm text-gray-600">Role</label>
// //               <p className="font-medium text-gray-900 capitalize">{user.role || 'user'}</p>
// //             </div>

// //             <div className="p-4 bg-gray-50 rounded-lg">
// //               <label className="text-sm text-gray-600">User ID</label>
// //               <p className="font-medium text-gray-900 font-mono text-sm">{user._id}</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserProfile;



// // app/profile/page.js
// "use client";
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axiosClient from '../utils/axiosClient';

// const UserProfile = () => {
//   const [user, setUser] = useState(null);
//   const [stats, setStats] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const [userPackages, setUserPackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statsLoading, setStatsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     console.log('🔍 Profile page checking authentication...');
    
//     const userData = localStorage.getItem('user');
//     const token = localStorage.getItem('accessToken');
    
//     console.log('📦 Profile - user data:', userData);
//     console.log('🔑 Profile - accessToken:', token);
    
//     if (!userData || !token) {
//       console.log('❌ Profile - No user data or token, redirecting to login');
//       router.push('/auth/login');
//       return;
//     }

//     try {
//       const parsedUser = JSON.parse(userData);
//       console.log('✅ Profile - User data parsed successfully:', parsedUser);
//       setUser(parsedUser);
//       loadUserData(parsedUser._id, token);
//     } catch (error) {
//       console.error('❌ Profile - Error parsing user data:', error);
//       router.push('/auth/login');
//     } finally {
//       setLoading(false);
//     }
//   }, [router]);

//   const loadUserData = async (userId, token) => {
//     try {
//       setStatsLoading(true);
      
//       // Load user posts
//       const postsRes = await axiosClient.get(`/tours/user/${userId}`);
//       const userPostsData = postsRes.data.data || postsRes.data || [];
//       setUserPosts(userPostsData);

//       // Load user packages if vendor
//       let userPackagesData = [];
//       if (user?.role === 'vendor') {
//         const packagesRes = await axiosClient.get(`/packages/user/${userId}`);
//         userPackagesData = packagesRes.data.data || packagesRes.data || [];
//         setUserPackages(userPackagesData);
//       }

//       // Calculate statistics
//       const userStats = {
//         totalPosts: userPostsData.length,
//         approvedPosts: userPostsData.filter(post => post.isApproved).length,
//         pendingPosts: userPostsData.filter(post => !post.isApproved).length,
//         totalPackages: userPackagesData.length,
//         approvedPackages: userPackagesData.filter(pkg => pkg.isApproved).length,
//         pendingPackages: userPackagesData.filter(pkg => !pkg.isApproved).length,
//       };
      
//       setStats(userStats);
//     } catch (error) {
//       console.error('Error loading user data:', error);
//     } finally {
//       setStatsLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('accessToken');
//     router.push('/auth/login');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
//         <div className="text-center">
//           <div className="text-red-500 text-lg mb-4">User not found</div>
//           <button 
//             onClick={() => router.push('/auth/login')}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
//       <div className="max-w-6xl mx-auto px-4">
//         {/* Header Section */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">User Profile</h1>
//           <p className="text-gray-600">Manage your account and view your contributions</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* User Information Card */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
//               <div className="text-center mb-6">
//                 <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <span className="text-white text-2xl font-bold">
//                     {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900">{user.name || 'User'}</h2>
//                 <p className="text-gray-600">{user.email}</p>
//                 <div className="mt-2">
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                     user.role === 'admin' 
//                       ? 'bg-purple-100 text-purple-800'
//                       : user.role === 'vendor'
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-blue-100 text-blue-800'
//                   }`}>
//                     {user.role?.toUpperCase() || 'USER'}
//                   </span>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="p-3 bg-gray-50 rounded-lg">
//                   <label className="text-sm text-gray-600">Phone</label>
//                   <p className="font-medium text-gray-900">{user.phone || 'Not provided'}</p>
//                 </div>
                
//                 <div className="p-3 bg-gray-50 rounded-lg">
//                   <label className="text-sm text-gray-600">User ID</label>
//                   <p className="font-medium text-gray-900 font-mono text-sm break-all">{user._id}</p>
//                 </div>

//                 <button 
//                   onClick={handleLogout}
//                   className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Statistics and Posts Section */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Statistics Cards */}
//             {statsLoading ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
//                 {[...Array(4)].map((_, i) => (
//                   <div key={i} className="bg-white rounded-xl p-6 shadow-sm h-32"></div>
//                 ))}
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Posts Statistics */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-semibold text-gray-800">Tour Posts</h3>
//                     <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Total Posts</span>
//                       <span className="font-bold text-gray-800">{stats?.totalPosts || 0}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Approved</span>
//                       <span className="font-bold text-green-600">{stats?.approvedPosts || 0}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Pending</span>
//                       <span className="font-bold text-orange-600">{stats?.pendingPosts || 0}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Packages Statistics (for vendors) */}
//                 {(user.role === 'vendor' || user.role === 'admin') && (
//                   <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-lg font-semibold text-gray-800">Tour Packages</h3>
//                       <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                       </svg>
//                     </div>
//                     <div className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600">Total Packages</span>
//                         <span className="font-bold text-gray-800">{stats?.totalPackages || 0}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600">Approved</span>
//                         <span className="font-bold text-green-600">{stats?.approvedPackages || 0}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600">Pending</span>
//                         <span className="font-bold text-orange-600">{stats?.pendingPackages || 0}</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Quick Actions */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
//                   <div className="space-y-3">
//                     <button 
//                       onClick={() => router.push('/tours/create')}
//                       className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
//                     >
//                       Create New Tour
//                     </button>
//                     {user.role === 'vendor' && (
//                       <button 
//                         onClick={() => router.push('/packages/create')}
//                         className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
//                       >
//                         Create New Package
//                       </button>
//                     )}
//                     {user.role === 'admin' && (
//                       <button 
//                         onClick={() => router.push('/admin')}
//                         className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors"
//                       >
//                         Admin Dashboard
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Account Status */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Member Since</span>
//                       <span className="font-medium text-gray-800">
//                         {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Status</span>
//                       <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
//                         Active
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Recent Posts Section */}
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-xl font-semibold text-gray-800">Recent Tour Posts</h3>
//                 <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                   {userPosts.length} posts
//                 </span>
//               </div>

//               {userPosts.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                   <p>No tour posts created yet</p>
//                   <button 
//                     onClick={() => router.push('/tours/create')}
//                     className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//                   >
//                     Create Your First Tour
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {userPosts.slice(0, 5).map(post => (
//                     <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <h4 className="font-semibold text-gray-800 mb-1">{post.name}</h4>
//                           <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.description}</p>
//                           <div className="flex items-center gap-4 text-xs text-gray-500">
//                             <span className={`inline-flex items-center px-2 py-1 rounded-full ${
//                               post.isApproved 
//                                 ? 'bg-green-100 text-green-800' 
//                                 : 'bg-orange-100 text-orange-800'
//                             }`}>
//                               {post.isApproved ? 'Approved' : 'Pending'}
//                             </span>
//                             <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
//                           </div>
//                         </div>
//                         <button 
//                           onClick={() => router.push(`/tours/${post._id}`)}
//                           className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
//                         >
//                           View
//                         </button>
//                       </div>
//                     </div>
//                   ))}
                  
//                   {userPosts.length > 5 && (
//                     <div className="text-center pt-4">
//                       <button 
//                         onClick={() => router.push('/my-tours')}
//                         className="text-blue-600 hover:text-blue-700 font-medium"
//                       >
//                         View All {userPosts.length} Posts →
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;


// app/profile/page.js
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllTourPlaces } from '../utils/TourPlace_CRUD'; 
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userPackages, setUserPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
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
      loadUserData(parsedUser._id);
    } catch (error) {
      console.error('❌ Profile - Error parsing user data:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const loadUserData = async (userId) => {
    try {
      setStatsLoading(true);
      setError(null);
      
      console.log('🔄 Loading user data for user ID:', userId);
      
      // Load all tours and filter by createdBy
      let userPostsData = [];
      let userPackagesData = [];

      try {
        // Get all tour places using your service function
        const allTours = await getAllTourPlaces();
        console.log('📊 All tours loaded:', allTours);
        
        // Filter tours by createdBy field
        userPostsData = allTours.filter(tour => {
          // Handle both string and ObjectId comparison
          const createdById = tour.createdBy?._id || tour.createdBy;
          console.log('🔍 Comparing:', createdById, 'with', userId);
          return createdById === userId || createdById?.toString() === userId;
        });
        
        console.log('✅ User posts filtered:', userPostsData);
      } catch (postsError) {
        console.error('❌ Error loading user posts:', postsError);
        setError('Failed to load tour posts. Please try again.');
      }

      setUserPosts(userPostsData);

      // For packages, you'll need to implement similar logic
      // Currently setting empty array since we don't have package service
      setUserPackages([]);

      // Calculate statistics
      const userStats = {
        totalPosts: userPostsData.length,
        approvedPosts: userPostsData.filter(post => post.isApproved).length,
        pendingPosts: userPostsData.filter(post => !post.isApproved).length,
        totalPackages: userPackagesData.length,
        approvedPackages: userPackagesData.filter(pkg => pkg.isApproved).length,
        pendingPackages: userPackagesData.filter(pkg => !pkg.isApproved).length,
      };
      
      console.log('📈 User statistics:', userStats);
      setStats(userStats);
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      setError('Failed to load user statistics. Please try again.');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    router.push('/auth/login');
  };

  const refreshData = () => {
    if (user) {
      loadUserData(user._id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">User not found</div>
          <button 
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Profile</h1>
          <p className="text-gray-600">Manage your account and view your contributions</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
              <button 
                onClick={refreshData}
                className="text-red-700 hover:text-red-800 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name || 'User'}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'vendor'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role?.toUpperCase() || 'USER'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="text-sm text-gray-600">Phone</label>
                  <p className="font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="text-sm text-gray-600">User ID</label>
                  <p className="font-medium text-gray-900 font-mono text-sm break-all">{user._id}</p>
                </div>

                <button 
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>

                <button 
                  onClick={refreshData}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Statistics and Posts Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics Cards */}
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm h-32"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Posts Statistics */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Tour Posts</h3>
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Posts</span>
                      <span className="font-bold text-gray-800">{stats?.totalPosts || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Approved</span>
                      <span className="font-bold text-green-600">{stats?.approvedPosts || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending</span>
                      <span className="font-bold text-orange-600">{stats?.pendingPosts || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Packages Statistics (for vendors) */}
                {(user.role === 'vendor' || user.role === 'admin') && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Tour Packages</h3>
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Packages</span>
                        <span className="font-bold text-gray-800">{stats?.totalPackages || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Approved</span>
                        <span className="font-bold text-green-600">{stats?.approvedPackages || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pending</span>
                        <span className="font-bold text-orange-600">{stats?.pendingPackages || 0}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => router.push('/addPlaces')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      Create New Tour
                    </button>
                    {(user.role === 'vendor' || user.role === 'admin') && (
                      <button 
                        onClick={() => router.push('/packages/create')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                      >
                        Create New Package
                      </button>
                    )}
                    {user.role === 'admin' && (
                      <button 
                        onClick={() => router.push('/admin')}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors"
                      >
                        Admin Dashboard
                      </button>
                    )}
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-medium text-gray-800">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Posts Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {userPosts.length > 0 ? 'My Tour Posts' : 'Tour Posts'}
                </h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {userPosts.length} posts
                </span>
              </div>

              {userPosts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="mb-2">No tour posts created yet</p>
                  <button 
                    onClick={() => router.push('/tours/create')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Create Your First Tour
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPosts.slice(0, 5).map(post => (
                    <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{post.name}</h4>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full ${
                              post.isApproved 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {post.isApproved ? 'Approved' : 'Pending'}
                            </span>
                            <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => router.push(`/tours/${post._id}`)}
                          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {userPosts.length > 5 && (
                    <div className="text-center pt-4">
                      <button 
                        onClick={() => router.push('/my-tours')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View All {userPosts.length} Posts →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;