"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";

const TourPackage = ({ pkg }) => {
  if (!pkg) return null;

  return (
    <div className="group h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100/50 overflow-hidden flex flex-col hover:border-teal-200/70">
      {/* Image Section */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-gray-300">
        <img
          src={pkg.images?.[0] || "/placeholder.jpg"}
          alt={pkg.name || "Tour Package"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {pkg.name || "Unnamed Package"}
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 mb-4 flex-1 line-clamp-3 leading-relaxed">
          {pkg.description || "No description available"}
        </p>

        {/* Location */}
        {pkg.location && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
              📍 Destination
            </p>
            <p className="text-sm text-gray-700 font-medium">
              {pkg.location.coordinates ? `Coordinates: ${pkg.location.coordinates[1]}, ${pkg.location.coordinates[0]}` : "Location TBA"}
            </p>
          </div>
        )}

        {/* Price and Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Price</p>
            <span className="text-2xl font-black bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              ৳ {pkg.price?.toLocaleString() || 0}
            </span>
          </div>

          <Link href={`/package/${pkg.id}`}>
            <button className="px-4 py-2 sm:py-3 bg-linear-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base whitespace-nowrap">
              View More
            </button>
          </Link>
        </div>

        {/* Approval Badge */}
        {pkg.isApproved && (
          <div className="mt-4 inline-flex items-center gap-2 w-fit px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <span className="text-sm text-green-700 font-semibold">✓ Approved</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourPackage;
