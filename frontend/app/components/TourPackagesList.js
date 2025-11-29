"use client";
import React, { useEffect, useState } from "react";
import TourPackage from "./TourPackage";
import { getAllTourPackages } from "../utils/TourPackage_CRUD";

const TourPackagesList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllTourPackages();
        console.log("Tour Packages Data:", data);
        setPackages(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Error loading packages:", err);
        setError(err.message || "Failed to load tour packages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-semibold">Loading tour packages...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8 px-6 bg-red-50 border-2 border-red-200 rounded-2xl max-w-md mx-auto">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-red-700 font-semibold text-lg mb-2">Error Loading Packages</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Packages Grid */}
        {!loading && !error && (
          <>
            {packages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-3xl mb-3">📦</p>
                <p className="text-gray-600 font-semibold text-lg">No tour packages available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {packages.map((pkg) => (
                  <TourPackage key={pkg._id || pkg.id} pkg={pkg} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default TourPackagesList;
