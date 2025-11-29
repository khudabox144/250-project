"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getAllDivisionsWithDistricts, testDivisionAPI } from "../utils/Location_CRUD";
import LoadingSpinner from "../common/LoadingSpinner";

// --- Image Map for Divisions ---
const DIVISION_IMAGES = {
  "Dhaka": "https://t3.ftcdn.net/jpg/05/98/42/60/360_F_598426018_dZSafUODg9I0cEBJrj8F4AHzYmrXrHdW.jpg",
  "Chittagong": "https://media-cdn.tripadvisor.com/media/photo-s/0a/74/f0/27/chittagong-port.jpg",
  "Sylhet": "https://grandsylhet.com/wp-content/uploads/2025/01/Best-Tourist-Places-in-Sylhet-1024x538.webp",
  "Khulna": "https://i.natgeofe.com/n/a50f7239-ff6d-4874-9448-25d94d8d1c80/sundarbans-bangladesh.jpg",
  "Barisal": "https://barishaltourismcenters.wordpress.com/wp-content/uploads/2018/11/pi.jpg",
  "Rajshahi": "https://ecdn.dhakatribune.net/contents/cache/images/640x0x1/uploads/media/2023/09/13/Rajshahi-Development-5-f6819dd6ea94084fd01a011dac7ca45d.jpg",
  "Rangpur": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/60/70/51/caption.jpg?w=800&h=800&s=1",
  "Mymensingh": "https://i.pinimg.com/736x/0b/11/88/0b11881451048581d97df71a2b25d64e.jpg"
};

// =============== Fake Data for Testing (fallback) ===============
const FALLBACK_DIVISIONS = [
  {
    _id: "1",
    name: "Dhaka",
    districts: [
      { _id: "d1", name: "Dhaka", tourPlaces: [] },
      { _id: "d2", name: "Gazipur", tourPlaces: [] },
      { _id: "d8", name: "Narayanganj", tourPlaces: [] },
    ],
  },
  {
    _id: "2",
    name: "Chittagong",
    districts: [
      { _id: "d3", name: "Cox's Bazar", tourPlaces: [] },
      { _id: "d4", name: "Bandarban", tourPlaces: [] },
      { _id: "d7", name: "Chittagong", tourPlaces: [] },
    ],
  },
  {
    _id: "3",
    name: "Sylhet",
    districts: [
      { _id: "d5", name: "Sylhet", tourPlaces: [] },
      { _id: "d6", name: "Sunamganj", tourPlaces: [] },
    ],
  },
];

// =============== BangladeshTourTest Component ===============
const BangladeshTourTest = () => {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDivision, setExpandedDivision] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fetch divisions with districts from your service
  useEffect(() => {
    let mounted = true;
    
    const loadDivisions = async () => {
      setLoading(true);
      setError(null);
      setUsingFallback(false);
      
      try {
        // Test the API first to see what's coming
        console.log("🧪 Starting API test...");
        const testResults = await testDivisionAPI();
        console.log("🧪 API Test Results:", testResults);
        
        // Use your service function that gets divisions with districts
        console.log("📡 Fetching divisions with districts...");
        const divisionsData = await getAllDivisionsWithDistricts();
        
        if (mounted) {
          console.log("🔍 Final processed divisions data:", divisionsData);
          
          if (divisionsData && divisionsData.length > 0) {
            console.log("✅ Divisions data loaded successfully");
            console.log("📊 Total divisions:", divisionsData.length);
            
            // Log each division and its districts
            divisionsData.forEach((division, index) => {
              console.log(`🏛️ Division ${index + 1}:`, division.name, "(ID:", division._id + ")");
              console.log(`   Districts count:`, division.districts?.length || 0);
              console.log(`   Districts:`, division.districts?.map(d => d.name) || []);
              if (division.districts && division.districts.length > 0) {
                console.log(`   Sample district:`, {
                  name: division.districts[0].name,
                  id: division.districts[0]._id,
                  division: division.districts[0].division,
                  divisionId: division.districts[0].divisionId
                });
              }
            });
            
            setDivisions(divisionsData);
          } else {
            console.log("⚠️ No data from API, using fallback");
            setDivisions(FALLBACK_DIVISIONS);
            setUsingFallback(true);
          }
        }
      } catch (err) {
        console.error('❌ Error fetching divisions:', err);
        if (mounted) {
          setError('Failed to load divisions data: ' + err.message);
          setDivisions(FALLBACK_DIVISIONS);
          setUsingFallback(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    loadDivisions();
    
    return () => { 
      mounted = false; 
    };
  }, []);

  // Helper function to get districts count for a division
  const getDistrictsCount = (division) => {
    if (division.districts && Array.isArray(division.districts)) {
      return division.districts.length;
    }
    return 0;
  };

  // Helper function to get tour places count for a district
  const getTourPlacesCount = (district) => {
    if (district.tourPlaces && Array.isArray(district.tourPlaces)) {
      return district.tourPlaces.length;
    }
    if (district.tourPlacesCount !== undefined) {
      return district.tourPlacesCount;
    }
    // If no tour places data, return 0 or a default value
    return 0;
  };

  // Helper function to get districts for a division
  const getDistricts = (division) => {
    if (division.districts && Array.isArray(division.districts)) {
      return division.districts;
    }
    return [];
  };

  // Calculate total stats
  const totalDistricts = divisions.reduce((sum, d) => sum + getDistrictsCount(d), 0);
  const totalDestinations = divisions.reduce((sum, division) => {
    const districts = getDistricts(division);
    return sum + districts.reduce((districtSum, district) => {
      return districtSum + getTourPlacesCount(district);
    }, 0);
  }, 0);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleUseFallback = () => {
    setDivisions(FALLBACK_DIVISIONS);
    setUsingFallback(true);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-linear-to-br from-teal-50 to-blue-50">
        <LoadingSpinner size="xl" color="teal" />
        <p className="mt-4 text-lg text-gray-700 font-semibold">Loading divisions and districts...</p>
        <p className="mt-2 text-sm text-gray-500">Fetching data from server</p>
      </div>
    );
  }

  if (error && divisions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="text-center p-8 bg-red-50 border-2 border-red-200 rounded-2xl shadow-lg max-w-md">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-700 mb-3">
            Failed to Load Data
          </h2>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={handleRetry} 
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={handleUseFallback} 
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Use Demo Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Demo Data Notice */}
        {usingFallback && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <p className="text-yellow-800 text-sm">
                Showing demo data. Some features may be limited.
              </p>
            </div>
          </div>
        )}

        {/* ========== Header Section ========== */}
        <header className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="mb-6 inline-block">
            <span className="text-5xl sm:text-6xl lg:text-7xl animate-bounce">🗺️</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-4">
            Explore the Beauty of
            <span className="block mt-2 bg-linear-to-r from-teal-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Bangladesh
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed font-light px-2">
            Discover the vibrant beauty and cultural richness of Bangladesh through its eight magnificent divisions, each with unique attractions and unforgettable experiences.
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-1 w-12 bg-linear-to-r from-transparent to-teal-500 rounded-full"></div>
            <div className="h-1 w-20 bg-teal-500 rounded-full"></div>
            <div className="h-1 w-12 bg-linear-to-l from-transparent to-teal-500 rounded-full"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-10">
            {[
              { label: "Divisions", value: divisions.length, icon: "📍" },
              { 
                label: "Districts", 
                value: totalDistricts, 
                icon: "🏘️" 
              },
              { 
                label: "Destinations", 
                value: totalDestinations, 
                icon: "🎒" 
              },
              { label: "Experiences", value: "∞", icon: "✨" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md hover:bg-white/90 transition-all duration-300 border border-white/50">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-xl sm:text-2xl font-bold text-teal-600 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-600 font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-bold text-blue-800 mb-2">Debug Info:</h3>
            <p className="text-xs text-blue-700">
              Divisions: {divisions.length} | Districts: {totalDistricts} | Destinations: {totalDestinations} | Using Fallback: {usingFallback ? 'Yes' : 'No'}
            </p>
          </div>
        )}

        {/* ========== Divisions Grid ========== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {divisions.map((division) => {
            const divisionImage = DIVISION_IMAGES[division.name] || "https://images.unsplash.com/photo-1540959733332-8cbd5d1a45f9?w=400&h=300&fit=crop";
            const districts = getDistricts(division);
            const districtsCount = getDistrictsCount(division);
            
            console.log(`🎯 Rendering ${division.name}:`, {
              divisionId: division._id,
              districtsCount,
              districts: districts.map(d => d.name)
            });
            
            return (
              <div
                key={division._id || division.id}
                className="group h-full"
                onMouseEnter={() => setExpandedDivision(division._id || division.id)}
                onMouseLeave={() => setExpandedDivision(null)}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100/50 overflow-hidden h-full flex flex-col hover:border-teal-200/70">
                  
                  {/* ========== Image Section with Overlay ========== */}
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-300">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out"
                      style={{
                        backgroundImage: `url(${divisionImage})`,
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

                    {/* Badge - Districts Count */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <div className="bg-teal-500/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg hover:bg-teal-400 transition-colors duration-300 cursor-default">
                        {districtsCount}
                        <span className="hidden sm:inline ml-1 font-semibold">Districts</span>
                      </div>
                    </div>

                    {/* Division Name - Absolute Position */}
                    <div className="absolute left-0 right-0 bottom-0 p-4 sm:p-6">
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider drop-shadow-lg group-hover:translate-y-0 transition-transform duration-300">
                        {division.name}
                      </h2>
                    </div>
                  </div>

                  {/* ========== Content Section ========== */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    {/* Section Header */}
                    <div className="mb-5">
                      <h3 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-4 flex items-center gap-2">
                        <div className="h-1 w-3 bg-linear-to-r from-teal-600 to-teal-400 rounded-full"></div>
                        {districtsCount > 0 ? "Popular Districts" : "No Districts Available"}
                      </h3>
                    </div>

                    {districtsCount > 0 ? (
                      <div className="flex-1 flex flex-col">
                        {/* District Grid - Responsive and Clean */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-5">
                          {districts.slice(0, 6).map((district, index) => {
                            console.log(`📍 Rendering district:`, {
                              name: district.name,
                              id: district._id,
                              division: district.division,
                              hasTourPlaces: getTourPlacesCount(district) > 0
                            });
                            
                            return (
                              <Link
                                key={district._id || `district-${index}`}
                                href={`/district/${district._id || district.id}`}
                                className="group/district"
                              >
                                <div className="relative p-3 bg-linear-to-br from-teal-50 to-cyan-50 rounded-lg hover:from-teal-100 hover:to-cyan-100 transition-all duration-300 border border-teal-100 hover:border-teal-400 hover:shadow-md overflow-hidden h-full flex flex-col justify-center">
                                  <div className="absolute inset-0 bg-linear-to-r from-teal-500 to-cyan-500 opacity-0 group-hover/district:opacity-5 transition-opacity duration-300"></div>
                                  
                                  <span className="text-xs sm:text-sm text-teal-800 group-hover/district:text-teal-700 font-semibold transition-colors line-clamp-1 relative z-10">
                                    {district.name}
                                  </span>
                                  
                                  {getTourPlacesCount(district) > 0 && (
                                    <div className="flex items-center mt-2 relative z-10">
                                      <span className="text-xs text-white bg-teal-500 px-2 py-0.5 rounded-full font-bold leading-none">
                                        {getTourPlacesCount(district)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            );
                          })}

                          {districtsCount > 6 && (
                            <Link href={`/division/${division._id || division.id}`} className="group/more">
                              <div className="p-3 bg-linear-to-br from-gray-100 to-gray-50 rounded-lg hover:from-gray-200 hover:to-gray-100 transition-all duration-300 border border-gray-200 hover:border-gray-400 hover:shadow-md flex items-center justify-center h-full">
                                <span className="text-xs sm:text-sm text-gray-600 group-hover/more:text-gray-800 font-bold transition-colors">
                                  +{districtsCount - 6}
                                </span>
                              </div>
                            </Link>
                          )}
                        </div>

                        {/* View All Link Button */}
                        <Link
                          href={`/division/${division._id || division.id}`}
                          className="mt-auto inline-flex items-center justify-between w-full px-4 py-2.5 bg-linear-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg hover:translate-y-0.5 group/link text-sm"
                        >
                          <span>Explore {division.name}</span>
                          <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-400 flex-1 flex flex-col items-center justify-center">
                        <p className="text-sm italic mb-2">No districts available for this division</p>
                        <div className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                          ID: {division._id}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========== Footer CTA Section ========== */}
        <div className="mt-16 sm:mt-24 text-center">
          <div className="bg-linear-to-r from-teal-600 to-cyan-600 rounded-3xl p-8 sm:p-12 shadow-2xl text-white max-w-2xl mx-auto hover:shadow-3xl transition-shadow duration-300 border border-teal-400/30">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black mb-4">Ready for an Adventure?</h3>
            <p className="text-white/90 mb-6 text-sm sm:text-base leading-relaxed">
              Discover exclusive tour packages and create unforgettable memories across all eight divisions of Bangladesh.
            </p>
            <Link href="/packages">
              <button className="w-full sm:w-auto px-8 py-3 bg-white text-teal-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform">
                View All Packages →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BangladeshTourTest;