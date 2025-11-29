"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axiosClient from '../../utils/axiosClient';
import TouristPlaceCard from '@/app/components/TouristPlaceCard';

const DistrictPage = () => {
  const params = useParams();
  const id = params?.id;
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [districtName, setDistrictName] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get('/tours', { params: { district: id } });
        setTours(res.data.data || res.data || []);
        setDistrictName('District'); // Replace with actual district name
      } catch (err) {
        console.error('Failed to load tours for district', err);
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-48 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 h-80 animate-pulse">
                <div className="h-40 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
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
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
        Tours in District
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
        Discover amazing tourist destinations and experiences
      </p>
    </div>

    {/* Results Info */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Featured Tours</h2>
        <p className="text-gray-600 mt-2">
          Showing {tours.length} tour{tours.length !== 1 ? 's' : ''} available
        </p>
      </div>
      
      {/* Sort Filter for larger screens */}
      <div className="hidden lg:flex items-center space-x-4">
        <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
          <option>Sort by: Popularity</option>
          <option>Sort by: Price</option>
          <option>Sort by: Rating</option>
        </select>
      </div>
    </div>

    {/* Responsive Grid */}
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
      {tours.map(tour => (
        <div key={tour._id} className="transform transition-all duration-300 hover:scale-[1.02]">
          <TouristPlaceCard place={tour} />
        </div>
      ))}
    </div>

    {/* Load More Button (conditional) */}
    {tours.length > 0 && (
      <div className="text-center mt-12">
        <button className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md">
          Load More Tours
        </button>
      </div>
    )}
  </div>
</div>
  );
};

export default DistrictPage;