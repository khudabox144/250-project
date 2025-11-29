// "use client";
// import React, { useEffect, useState } from 'react';
// import axiosClient from '../utils/axiosClient';

// const AllDestinationPage = () => {
//   const [tours, setTours] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await axiosClient.get('/tours');
//         setTours(res.data.data || res.data || []);
//       } catch (err) {
//         console.error('Failed to load tours', err);
//         setError('Failed to load destinations');
//       } finally { setLoading(false); }
//     };
//     load();
//   }, []);

//   if (loading) return <div className="p-8">Loading destinations...</div>;
//   if (error) return <div className="p-8 text-red-600">{error}</div>;

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">All Destinations</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {tours.map(t => (
//           <div key={t._id} className="border rounded p-4">
//             <h3 className="font-semibold">{t.name}</h3>
//             <p className="text-sm text-gray-600">{t.description?.slice(0,120)}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllDestinationPage;



"use client";
import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import TouristPlaceCard from '../components/TouristPlaceCard'; // Adjust import path as needed

const AllDestinationPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/tours');
        setTours(res.data.data || res.data || []);
      } catch (err) {
        console.error('Failed to load tours', err);
        setError('Failed to load destinations. Please try again later.');
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, []);

  // Filter and sort tours
  const filteredAndSortedTours = tours
    .filter(tour => 
      tour.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.location?.district?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name?.localeCompare(b.name);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-12 animate-pulse">
            <div className="h-10 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-48 mx-auto"></div>
          </div>
          
          {/* Search and Filter Skeleton */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8 animate-pulse">
            <div className="h-12 bg-gray-300 rounded-lg flex-1"></div>
            <div className="h-12 bg-gray-300 rounded-lg w-48"></div>
          </div>
          
          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-red-200">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Destinations</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Explore All Destinations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing tourist places and experiences across Bangladesh
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search destinations, locations, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'All Destinations'}
            </h2>
            <p className="text-gray-600 mt-2">
              Showing {filteredAndSortedTours.length} of {tours.length} destination{filteredAndSortedTours.length !== 1 ? 's' : ''}
              {searchTerm && ` matching your search`}
            </p>
          </div>
          
          {/* Clear Search */}
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Search
            </button>
          )}
        </div>

        {/* Destinations Grid */}
        {filteredAndSortedTours.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-gray-200">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Destinations Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No destinations found matching "${searchTerm}". Try different keywords.`
                  : 'No destinations available at the moment.'
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View All Destinations
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Destinations Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {filteredAndSortedTours.map(tour => (
                <div key={tour._id} className="transform transition-all duration-300 hover:scale-[1.02]">
                  <TouristPlaceCard place={tour} />
                </div>
              ))}
            </div>

            {/* Load More Button (if you implement pagination later) */}
            <div className="text-center mt-12">
              <button className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md">
                Load More Destinations
              </button>
            </div>
          </>
        )}

        {/* Quick Stats */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{tours.length}</div>
              <div className="text-sm text-gray-600 font-medium">Total Destinations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {tours.filter(tour => tour.isApproved).length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Approved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {tours.filter(tour => !tour.isApproved).length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {new Set(tours.map(tour => tour.location?.district)).size}
              </div>
              <div className="text-sm text-gray-600 font-medium">Districts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDestinationPage;