"use client";
import React from 'react';

const DetailView = ({ item, type = 'tour' }) => {
  if (!item) return <div className="p-6">No details found.</div>;

  // Static fallback images
  const fallbackImages = {
    tour: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    package: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    default: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
  };

  const getFallbackImage = () => {
    return fallbackImages[type] || fallbackImages.default;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isApproved) => {
    return isApproved ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Approved
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Pending Approval
      </span>
    );
  };

  const images = item.images && item.images.length > 0 ? item.images : [getFallbackImage()];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Image Section */}
          <div className="relative h-64 sm:h-80 md:h-96 bg-gray-200">
            <img
              src={images[0].startsWith('http') ? images[0] : `${process.env.NEXT_PUBLIC_SERVER_BASE_URL?.replace('/api','')}/${images[0]}`}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = getFallbackImage();
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Header Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                    {item.name}
                  </h1>
                  <div className="flex flex-wrap gap-2 items-center">
                    {getStatusBadge(item.isApproved)}
                    {item.createdAt && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(item.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About this {type}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                {item.description}
              </p>
            </div>

            {/* Additional Images Gallery */}
            {images.length > 1 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.slice(1).map((img, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                      <img
                        src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_SERVER_BASE_URL?.replace('/api','')}/${img}`}
                        alt={`${item.name} - Image ${i + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = getFallbackImage();
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Location Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold">D</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Division</p>
                      <p className="font-semibold text-gray-900">{item.division?.name || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-600 font-bold">D</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">District</p>
                      <p className="font-semibold text-gray-900">{item.district?.name || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Additional Info
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-600">Place ID</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{item._id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-600">Status</span>
                    {getStatusBadge(item.isApproved)}
                  </div>
                  
                  {item.createdBy && (
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Created By</span>
                      <span className="font-medium text-gray-900">{item.createdBy}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location Map Preview (if coordinates exist) */}
            {item.location?.coordinates && (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Location on Map
                </h3>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-gray-600 mb-2">Coordinates available</p>
                  <p className="text-sm text-gray-500 font-mono">
                    {item.location.coordinates[1]}, {item.location.coordinates[0]}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;