"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const TouristPlaceCard = ({ place }) => {
  const image =
    place.images?.length > 0
      ? place.images[0]
      : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div className="group h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100/50 overflow-hidden flex flex-col hover:border-teal-200/70">
      {/* Image Section */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-gray-300">
        <img
          src={image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {place.name}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 line-clamp-3 mb-4 flex-1 leading-relaxed">
          {place.description}
        </p>

        {/* Location */}
        {place.location?.district && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
              📍 Location
            </p>
            <p className="text-sm text-gray-700 font-medium">
              {place.location.district}, {place.location.division}
            </p>
          </div>
        )}

        {/* View Details Link */}
        <Link
          href={`/places/${place.id}`}
          className="mt-auto inline-flex items-center justify-between px-4 py-2.5 bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold rounded-lg text-center transition-all duration-300 shadow-md hover:shadow-lg hover:translate-y-0.5 group/link text-sm"
        >
          <span>View Details</span>
          <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default TouristPlaceCard;
