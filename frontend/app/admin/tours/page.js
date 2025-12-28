// "use client";
// import React, { useEffect, useState } from 'react';
// import axiosClient from '../../utils/axiosClient';
// import Link from 'next/link';

// const AdminToursPage = () => {
//   const [tours, setTours] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const load = async () => {
//     setLoading(true);
//     try {
//       const res = await axiosClient.get('/admin/pending/tours');
//       setTours(res.data.data || []);
//     } catch (err) {
//       console.error('Failed to load pending tours', err);
//     } finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, []);

//   const handleApprove = async (id) => { await axiosClient.patch(`/admin/tour/${id}/approve`); await load(); };
//   const handleReject = async (id) => { await axiosClient.patch(`/admin/tour/${id}/reject`); await load(); };

//   if (loading) return <div className="p-8">Loading pending tours...</div>;

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Pending Tour Places</h1>
//       <div className="space-y-4">
//         {tours.map(t => (
//           <div key={t._id} className="p-4 border rounded flex items-start">
//             <div className="flex-1">
//               <div className="font-semibold">{t.name}</div>
//               <div className="text-sm text-gray-600">{t.description?.slice(0,120)}</div>
//             </div>
//             <div className="space-x-2">
//               <button onClick={() => handleApprove(t._id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
//               <button onClick={() => handleReject(t._id)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminToursPage;



"use client";
import React, { useEffect, useState } from 'react';
import axiosClient from '@/app/utils/axiosClient';
import Link from 'next/link';

const AdminToursPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/pending/tours');
      setTours(res.data.data || []);
    } catch (err) {
      console.error('Failed to load pending tours', err);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  const handleApprove = async (id) => {
    if (!confirm('Are you sure you want to approve this tour?')) return;
    
    setActionLoading(id);
    try {
      await axiosClient.patch(`/admin/tour/${id}/approve`);
      await load();
    } catch (err) {
      console.error('Approve failed', err);
      alert('Failed to approve tour');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this tour?')) return;
    
    setActionLoading(id);
    try {
      await axiosClient.patch(`/admin/tour/${id}/reject`);
      await load();
    } catch (err) {
      console.error('Reject failed', err);
      alert('Failed to reject tour');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="animate-pulse mb-8">
            <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-96"></div>
          </div>
          
          {/* Cards Skeleton */}
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-48 h-40 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="flex gap-4 pt-2">
                      <div className="h-10 bg-gray-300 rounded w-24"></div>
                      <div className="h-10 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Pending Tour Places</h1>
              <p className="text-gray-600">
                Review and manage tour submissions waiting for approval
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/admin" 
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{tours.length}</div>
                  <div className="text-sm text-gray-600">Total Pending</div>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="text-sm text-gray-600">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
              <button 
                onClick={load}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Tours List */}
        {tours.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              There are no pending tours waiting for approval. All submissions have been reviewed.
            </p>
            <Link 
              href="/admin"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {tours.map(tour => (
              <div key={tour._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-64 xl:w-80 h-48 lg:h-auto bg-gray-100 relative">
                    {tour.images && tour.images[0] ? (
                      <img 
                        src={tour.images[0].startsWith('http') ? tour.images[0] : `${process.env.NEXT_PUBLIC_SERVER_BASE_URL?.replace('/api','')}/${tour.images[0]}`} 
                        alt={tour.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="text-center text-gray-500">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">No image</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Pending Review
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{tour.name}</h3>
                        
                        {tour.description && (
                          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                            {tour.description}
                          </p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          {tour.location?.district && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span>{tour.location.district}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Created: {new Date(tour.createdAt).toLocaleDateString()}</span>
                          </div>

                          {tour.price && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              <span>${tour.price}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-4 border-t border-gray-200">
                        <button 
                          onClick={() => handleApprove(tour._id)}
                          disabled={actionLoading === tour._id}
                          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1"
                        >
                          {actionLoading === tour._id ? (
                            <>
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approve Tour
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => handleReject(tour._id)}
                          disabled={actionLoading === tour._id}
                          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject Tour
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminToursPage;