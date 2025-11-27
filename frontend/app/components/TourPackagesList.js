// "use client" is NOT needed here because this is a server component
import React from "react";
import TourPackage from "./TourPackage";

// ------------------ FAKE DATA ------------------ //
const fakePackages = [
  {
    id: "691f111a40d7e555e91c130c",
    name: "Cox's Bazar Premium Tour Package",
    description: "A 3-day, 2-night luxury tour including hotel, breakfast, and beach activities.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop"
    ],
    price: 8500,
    division: "64f0c2a1b1234abcd5678901",
    district: "691ef4c707634647b6769ab9",
    location: { type: "Point", coordinates: [91.987, 21.435] },
    isApproved: false,
    createdAt: "2025-11-20T13:01:14.519+00:00",
    __v: 0
  },
  {
    id: "691f111a40d7e555e91c130d",
    name: "Sundarban Adventure Package",
    description: "Explore the largest mangrove forest in the world with guided tours.",
    images: [
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop"
    ],
    price: 6200,
    division: "64f0c2a1b1234abcd5678902",
    district: "691ef4c707634647b6769ab8",
    location: { type: "Point", coordinates: [89.988, 22.035] },
    isApproved: true,
    createdAt: "2025-11-20T14:10:10.000+00:00",
    __v: 0
  },
];

// ------------------ SERVER COMPONENT ------------------ //
const TourPackagesList = async () => {
  const packagesToDisplay = fakePackages;

  return (
    <section className="relative min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4">
            Exclusive
            <span className="block mt-2 bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Tour Packages
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Handpicked tour packages crafted to give you the best experience in Bangladesh.
          </p>
        </header>

        {packagesToDisplay.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">📦</p>
            <p className="text-gray-600 font-semibold text-lg">No tour packages available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {packagesToDisplay.map((pkg) => (
              <TourPackage key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TourPackagesList;
