// "use client";
// import React, { useEffect, useState } from 'react';
// import axiosClient from '../utils/axiosClient';
// import Link from 'next/link';

// const AdminDashboard = () => {
//   const [summary, setSummary] = useState(null);
//   const [pendingTours, setPendingTours] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const loadData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [sRes, pRes, uRes] = await Promise.all([
//         axiosClient.get('/admin/dashboard'),
//         axiosClient.get('/admin/pending/tours'),
//         axiosClient.get('/admin/users'),
//       ]);

//       setSummary(sRes.data.data || null);
//       setPendingTours(pRes.data.data || []);
//       setUsers(uRes.data.data || []);
//     } catch (err) {
//       console.error('Admin load error', err);
//       setError(err.message || 'Failed to load admin data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadData(); }, []);

//   const handleApproveTour = async (id) => {
//     if (!confirm('Approve this tour?')) return;
//     try {
//       setActionLoading(true);
//       await axiosClient.patch(`/admin/tour/${id}/approve`);
//       await loadData();
//     } catch (err) {
//       console.error('Approve error', err);
//       alert('Approve failed');
//     } finally { setActionLoading(false); }
//   };

//   const handleRejectTour = async (id) => {
//     if (!confirm('Reject this tour?')) return;
//     try {
//       setActionLoading(true);
//       await axiosClient.patch(`/admin/tour/${id}/reject`);
//       await loadData();
//     } catch (err) {
//       console.error('Reject error', err);
//       alert('Reject failed');
//     } finally { setActionLoading(false); }
//   };

//   if (loading) return <div className="p-8">Loading admin dashboard...</div>;
//   if (error) return <div className="p-8 text-red-600">{error}</div>;

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="p-4 border rounded">Users: <strong>{summary?.totalUsers}</strong></div>
//         <div className="p-4 border rounded">Tours: <strong>{summary?.totalTours}</strong> (Pending: {summary?.pendingTours})</div>
//         <div className="p-4 border rounded">Packages: <strong>{summary?.totalPackages}</strong> (Pending: {summary?.pendingPackages})</div>
//       </div>

//       <div className="flex items-center space-x-3 mb-6">
//         <Link href="/admin/tours" className="px-3 py-2 bg-blue-600 text-white rounded">View All Pending Tours</Link>
//         <Link href="/admin/packages" className="px-3 py-2 bg-blue-600 text-white rounded">View All Pending Packages</Link>
//       </div>

//       <section className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Pending Tour Places</h2>
//         {pendingTours.length === 0 && <div className="text-gray-600">No pending tours.</div>}
//         <div className="space-y-4">
//           {pendingTours.map(t => (
//             <div key={t._id} className="p-4 border rounded flex items-start space-x-4">
//               <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
//                 {t.images && t.images[0] ? (
//                   <img src={`${process.env.NEXT_PUBLIC_SERVER_BASE_URL.replace('/api','')}/${t.images[0]}`} alt="img" className="w-full h-full object-cover" />
//                 ) : <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No image</div>}
//               </div>
//               <div className="flex-1">
//                 <div className="font-semibold">{t.name}</div>
//                 <div className="text-sm text-gray-600">Created: {new Date(t.createdAt).toLocaleString()}</div>
//                 <div className="mt-2 space-x-2">
//                   <button disabled={actionLoading} onClick={() => handleApproveTour(t._id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
//                   <button disabled={actionLoading} onClick={() => handleRejectTour(t._id)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section>
//         <h2 className="text-xl font-semibold mb-2">Recent Users</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {summary?.recentUsers?.map(u => (
//             <div key={u._id} className="p-3 border rounded">
//               <div className="font-semibold">{u.name || u.email}</div>
//               <div className="text-sm text-gray-600">{u.email}</div>
//               <div className="text-xs text-gray-500">Role: {u.role}</div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AdminDashboard;


"use client";
import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import Link from 'next/link';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [pendingTours, setPendingTours] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sRes, pRes, uRes] = await Promise.all([
        axiosClient.get('/admin/dashboard'),
        axiosClient.get('/admin/pending/tours'),
        axiosClient.get('/admin/users'),
      ]);

      setSummary(sRes.data.data || null);
      setPendingTours(pRes.data.data || []);
      setUsers(uRes.data.data || []);
    } catch (err) {
      console.error('Admin load error', err);
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleApproveTour = async (id) => {
    if (!confirm('Approve this tour?')) return;
    try {
      setActionLoading(true);
      await axiosClient.patch(`/admin/tour/${id}/approve`);
      await loadData();
    } catch (err) {
      console.error('Approve error', err);
      alert('Approve failed');
    } finally { setActionLoading(false); }
  };

  const handleRejectTour = async (id) => {
    if (!confirm('Reject this tour?')) return;
    try {
      setActionLoading(true);
      await axiosClient.patch(`/admin/tour/${id}/reject`);
      await loadData();
    } catch (err) {
      console.error('Reject error', err);
      alert('Reject failed');
    } finally { setActionLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm h-32"></div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm h-64 mb-8"></div>
            <div className="bg-white rounded-xl p-6 shadow-sm h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage tours, packages, and users</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{summary?.totalUsers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tours</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{summary?.totalTours || 0}</p>
                <p className="text-xs text-orange-600 mt-1">Pending: {summary?.pendingTours || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Packages</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{summary?.totalPackages || 0}</p>
                <p className="text-xs text-orange-600 mt-1">Pending: {summary?.pendingPackages || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {(summary?.pendingTours || 0) + (summary?.pendingPackages || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link 
            href="/admin/tours" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View All Pending Tours
          </Link>
          <Link 
            href="/admin/packages" 
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            View All Pending Packages
          </Link>
        </div>

        {/* Pending Tours Section */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Pending Tour Places</h2>
            <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
              {pendingTours.length} pending
            </span>
          </div>
          
          {pendingTours.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No pending tours to review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTours.map(tour => (
                <div key={tour._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {tour.images && tour.images[0] ? (
                          <img 
                            src={tour.images[0].startsWith('http') ? tour.images[0] : `${process.env.NEXT_PUBLIC_SERVER_BASE_URL?.replace('/api','')}/${tour.images[0]}`}
                            alt={tour.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-xs text-gray-500">No image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{tour.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Created: {new Date(tour.createdAt).toLocaleDateString()} at {new Date(tour.createdAt).toLocaleTimeString()}
                      </p>
                      {tour.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{tour.description}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                      <button 
                        disabled={actionLoading}
                        onClick={() => handleApproveTour(tour._id)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>
                      <button 
                        disabled={actionLoading}
                        onClick={() => handleRejectTour(tour._id)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Users Section */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Users</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {summary?.recentUsers?.map(user => (
              <div key={user._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-800 truncate">{user.name || 'No Name'}</h3>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {(!summary?.recentUsers || summary.recentUsers.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No recent users</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
