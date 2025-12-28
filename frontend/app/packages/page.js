"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllDivisions,getAllDistricts } from '../utils/Location_CRUD';
import { getAllTourPackages, searchTourPackages, getTourPackagesByDistrict, getTourPackagesByDivision } from '../utils/TourPackage_CRUD';

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [durationFilter, setDurationFilter] = useState('all');
  const [divisionFilter, setDivisionFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [availableDivisions, setAvailableDivisions] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const router = useRouter();

  // Load packages and location data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [packagesData, divisionsData, districtsData] = await Promise.all([
          getAllTourPackages(),
          getAllDivisions(),
          getAllDistricts()
        ]);

        // Filter only approved packages for public view
        const approvedPackages = packagesData.filter(pkg => pkg.isApproved);
        setPackages(approvedPackages);
        setFilteredPackages(approvedPackages);
        setAvailableDivisions(divisionsData || []);
        setAvailableDistricts(districtsData || []);
        setFilteredDistricts(districtsData || []);

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter districts when division changes
  useEffect(() => {
    if (divisionFilter === 'all') {
      setFilteredDistricts(availableDistricts);
      setDistrictFilter('all');
    } else {
      const districtsInDivision = availableDistricts.filter(
        district => district.division === divisionFilter || district.divisionId === divisionFilter
      );
      setFilteredDistricts(districtsInDivision);
      setDistrictFilter('all');
    }
  }, [divisionFilter, availableDistricts]);

  // Apply filters
  useEffect(() => {
    let filtered = packages.filter(pkg => {
      // Search filter
      const matchesSearch = 
        pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.location?.address?.toLowerCase().includes(searchTerm.toLowerCase());

      // Price filter
      const matchesPrice = pkg.price >= priceRange[0] && pkg.price <= priceRange[1];

      // Duration filter
      const matchesDuration = 
        durationFilter === 'all' ||
        (durationFilter === 'short' && pkg.days <= 3) ||
        (durationFilter === 'medium' && pkg.days > 3 && pkg.days <= 7) ||
        (durationFilter === 'long' && pkg.days > 7);

      // Division filter
      const matchesDivision = 
        divisionFilter === 'all' || 
        pkg.division === divisionFilter || 
        pkg.division?._id === divisionFilter;

      // District filter
      const matchesDistrict = 
        districtFilter === 'all' || 
        pkg.district === districtFilter || 
        pkg.district?._id === districtFilter;

      return matchesSearch && matchesPrice && matchesDuration && matchesDivision && matchesDistrict;
    });

    // Sort packages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'duration':
          return b.days - a.days;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredPackages(filtered);
  }, [packages, searchTerm, priceRange, durationFilter, divisionFilter, districtFilter, sortBy]);

  const handlePackageClick = (packageId) => {
    router.push(`/packages/${packageId}`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 10000]);
    setDurationFilter('all');
    setDivisionFilter('all');
    setDistrictFilter('all');
    setSortBy('newest');
  };

  // Calculate price range for slider
  const maxPrice = Math.max(...packages.map(pkg => pkg.price || 0), 10000);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-12 animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
          
          {/* Filters Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Packages Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                <div className="space-y-4">
                  <div className="h-48 bg-gray-300 rounded-lg"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-10 bg-gray-300 rounded flex-1"></div>
                    <div className="h-10 bg-gray-300 rounded flex-1"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Explore Tour Packages
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing tour packages across Bangladesh. Find your perfect adventure with curated experiences.
          </p>
        </div>

        {/* Filters and Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Search Box */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Packages
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>${maxPrice}</span>
                </div>
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Durations</option>
                <option value="short">Short (1-3 days)</option>
                <option value="medium">Medium (4-7 days)</option>
                <option value="long">Long (8+ days)</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Duration</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Location Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Division Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Division
              </label>
              <select
                value={divisionFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Divisions</option>
                {availableDivisions.map(division => (
                  <option key={division._id} value={division._id}>
                    {division.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                disabled={divisionFilter === 'all' || filteredDistricts.length === 0}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="all">All Districts</option>
                {filteredDistricts.map(district => (
                  <option key={district._id} value={district._id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredPackages.length} {filteredPackages.length === 1 ? 'Package' : 'Packages'} Found
            </h2>
            {filteredPackages.length !== packages.length && (
              <p className="text-gray-600 text-sm mt-1">
                Filtered from {packages.length} total packages
              </p>
            )}
          </div>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Packages Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || divisionFilter !== 'all' || districtFilter !== 'all' 
                ? 'Try adjusting your search criteria or filters to find more packages.'
                : 'There are currently no tour packages available. Please check back later.'}
            </p>
            {(searchTerm || divisionFilter !== 'all' || districtFilter !== 'all') && (
              <button 
                onClick={resetFilters}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPackages.map(pkg => (
              <div 
                key={pkg._id} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group cursor-pointer"
                onClick={() => handlePackageClick(pkg._id)}
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {pkg.images && pkg.images[0] ? (
                    <img 
                      src={pkg.images[0].startsWith('http') ? pkg.images[0] : `${process.env.NEXT_PUBLIC_SERVER_BASE_URL?.replace('/api','')}/${pkg.images[0]}`} 
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                      <div className="text-center text-blue-600">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="text-sm font-medium">Package Image</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                    ${pkg.price}
                  </div>
                  {pkg.isApproved && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                      Verified
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {pkg.name}
                      </h3>
                      
                      {pkg.description && (
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm">
                          {pkg.description}
                        </p>
                      )}

                      {/* Package Details */}
                      <div className="space-y-2 mb-4">
                        {/* Duration */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            {pkg.days && `${pkg.days} day${pkg.days > 1 ? 's' : ''}`}
                            {pkg.days && pkg.nights && ' • '}
                            {pkg.nights && `${pkg.nights} night${pkg.nights > 1 ? 's' : ''}`}
                          </span>
                        </div>

                        {/* Location */}
                        {pkg.location?.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="line-clamp-1">{pkg.location.address}</span>
                          </div>
                        )}

                        {/* Highlights */}
                        {pkg.highlights && pkg.highlights.length > 0 && (
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <span className="line-clamp-2">
                              {pkg.highlights.slice(0, 2).join(', ')}
                              {pkg.highlights.length > 2 && '...'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 group-hover:scale-105 transform transition-transform">
                      View Package Details
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Section (if needed) */}
        {filteredPackages.length > 0 && filteredPackages.length < packages.length && (
          <div className="text-center mt-12">
            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 px-8 rounded-xl font-medium transition-colors shadow-sm">
              Load More Packages
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;