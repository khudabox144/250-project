"use client";
import React, { useState } from 'react';

import BookingModal from './BookingModal';

const PackageDetailView = ({ item }) => {
  const [imageErrors, setImageErrors] = useState({});
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (!item) return <div className="p-6">No package details found.</div>;

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount || 0);
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    
    try {
      const cleanImg = img.replace(/^\//, '');
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${baseUrl}/${cleanImg}`;
    } catch (error) {
      console.error('Error constructing image URL:', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {item.name || item.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                  {item.isApproved && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Approved
                    </span>
                  )}
                  {item.duration && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.duration} days
                    </span>
                  )}
                  {item.price && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {formatCurrency(item.price)}
                    </span>
                  )}
                </div>
              </div>
              
              {item.price && (
                <div className="lg:text-right mt-4 lg:mt-0 flex flex-col items-end gap-3">
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(item.price)}
                  </div>
                  <div className="text-sm text-gray-500">Total package price</div>
                  <button 
                    onClick={() => setIsBookingOpen(true)}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
                  >
                    <span>Book Now</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <BookingModal 
                    isOpen={isBookingOpen} 
                    onClose={() => setIsBookingOpen(false)} 
                    packageItem={item} 
                  />
                </div>
              )}
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {item.description}
            </p>

            {/* Package Highlights */}
            {(item.highlights || item.inclusions) && (
              <div className="bg-gray-50 rounded-xl p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Package Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.highlights?.map((highlight, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                  {item.inclusions?.map((inclusion, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{inclusion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images Gallery */}
        {item.images && item.images.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Package Gallery</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {item.images.map((img, i) => {
                  const imageUrl = getImageUrl(img);
                  const hasError = imageErrors[i] || !imageUrl;
                  
                  return (
                    <div 
                      key={i} 
                      className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      {!hasError ? (
                        <img 
                          src={imageUrl} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          alt={`${item.name || item.title} - Image ${i + 1}`}
                          onError={() => handleImageError(i)}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <div className="text-center text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">Image not available</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Package Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Package Information */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Package Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {item.duration && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-900">Duration</span>
                    <span className="text-sm text-gray-600">{item.duration} days</span>
                  </div>
                )}
                
                {item.difficulty && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-900">Difficulty Level</span>
                    <span className="text-sm text-gray-600 capitalize">{item.difficulty}</span>
                  </div>
                )}
                
                {item.groupSize && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-900">Group Size</span>
                    <span className="text-sm text-gray-600">Up to {item.groupSize} people</span>
                  </div>
                )}
                
                {item.accommodation && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-900">Accommodation</span>
                    <span className="text-sm text-gray-600">{item.accommodation}</span>
                  </div>
                )}
                
                {item.transport && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-900">Transport</span>
                    <span className="text-sm text-gray-600">{item.transport}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location & Additional Info */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Location & Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {item.division && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-semibold text-gray-900">Division</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.division?.name || item.division}
                      </p>
                    </div>
                  </div>
                )}

                {item.district && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-semibold text-gray-900">District</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.district?.name || item.district}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-900">Package ID</span>
                  <span className="text-sm text-gray-600 font-mono">{item._id}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-900">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.isApproved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.isApproved ? 'Approved' : 'Pending Approval'}
                  </span>
                </div>

                {item.createdAt && (
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-900">Created Date</span>
                    <span className="text-sm text-gray-600">{formatDate(item.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary Section */}
        {item.itinerary && item.itinerary.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Package Itinerary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {item.itinerary.map((day, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-bold">Day {index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {day.title || `Day ${index + 1}`}
                      </h4>
                      <p className="text-gray-600">{day.description}</p>
                      {day.activities && (
                        <ul className="mt-2 space-y-1">
                          {day.activities.map((activity, activityIndex) => (
                            <li key={activityIndex} className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageDetailView;