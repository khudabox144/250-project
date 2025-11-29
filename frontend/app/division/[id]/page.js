// "use client";
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import axiosClient from '../../utils/axiosClient';
// import Link from 'next/link';

// const DivisionPage = () => {
//   const params = useParams();
//   const id = params?.id; // division id
//   const [districts, setDistricts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
//     const load = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosClient.get(`/districts/division/${id}`);
//         setDistricts(res.data.data || res.data || []);
//       } catch (err) {
//         console.error('Failed to load districts for division', err);
//       } finally { setLoading(false); }
//     };
//     load();
//   }, [id]);

//   if (loading) return <div className="p-8">Loading districts...</div>;

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Districts</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {districts.map(d => (
//           <Link key={d._id} href={`/district/${d._id}`} className="border rounded p-4 block hover:shadow">
//             <div className="font-semibold">{d.name}</div>
//             <div className="text-sm text-gray-600">Click to view tours</div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DivisionPage;



"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axiosClient from '../../utils/axiosClient';
import Link from 'next/link';

const DivisionPage = () => {
  const params = useParams();
  const id = params?.id; // division id
  const [districts, setDistricts] = useState([]);
  const [divisionName, setDivisionName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const [districtsRes, divisionRes] = await Promise.all([
          axiosClient.get(`/districts/division/${id}`),
          // If you have an endpoint to get division details
          // axiosClient.get(`/divisions/${id}`)
        ]);
        
        setDistricts(districtsRes.data.data || districtsRes.data || []);
        // Set division name if available from response or use a default
        setDivisionName('Division'); // Replace with actual division name from API
      } catch (err) {
        console.error('Failed to load districts for division', err);
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-12 animate-pulse">
            <div className="h-10 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-48 mx-auto"></div>
          </div>
          
          {/* Districts Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
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
            Districts in {divisionName}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore beautiful tourist destinations across all districts in this division
          </p>
          
          {/* Stats Bar */}
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 max-w-md mx-auto border border-white/50">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{districts.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Districts</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{districts.length}</div>
                <div className="text-sm text-gray-600 font-medium">Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Districts Grid */}
        {districts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-white/50">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Districts Found</h3>
              <p className="text-gray-600 mb-6">We couldn't find any districts in this division.</p>
              <Link 
                href="/"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">All Districts</h2>
                <p className="text-gray-600 mt-2">
                  Discover {districts.length} district{districts.length !== 1 ? 's' : ''} in {divisionName}
                </p>
              </div>
              
              {/* Sort Filter */}
              <div className="flex items-center space-x-4">
                <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                  <option>Sort by: Name</option>
                  <option>Sort by: Popularity</option>
                  <option>Sort by: District Count</option>
                </select>
              </div>
            </div>

            {/* Districts Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {districts.map(district => (
                <Link 
                  key={district._id} 
                  href={`/district/${district._id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100/50 overflow-hidden hover:border-blue-200/70 h-full flex flex-col">
                    
                    {/* District Image/Icon Section */}
                    <div className="relative h-32 bg-gradient-to-br from-blue-500 to-cyan-500 overflow-hidden">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      
                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {district.name}
                        </h3>
                        
                        {/* Additional District Info */}
                        {district.tourCount !== undefined && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{district.tourCount} tours available</span>
                          </div>
                        )}

                        {district.population && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            <span>{district.population.toLocaleString()} people</span>
                          </div>
                        )}
                      </div>

                      {/* CTA Section */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
                            Explore Tours
                          </span>
                          <svg className="w-5 h-5 text-blue-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button (if pagination is needed) */}
            <div className="text-center mt-12">
              <button className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md">
                Load More Districts
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DivisionPage;
