"use client";
import React, { useEffect, useState } from "react";
import TouristPlaceCard from "./TouristPlaceCard";
import { getAllTourPlaces } from "../utils/TourPlace_CRUD";

const TouristPlaceList = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(8);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllTourPlaces();
        console.log("Tourist Places Data:", data);
        setPlaces(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Error loading places:", err);
        setError(err.message || "Failed to load places. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Filter by search
  const filteredPlaces = places.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

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
            Discover
            <span className="block mt-2 bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Amazing Places
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Explore the most beautiful and exciting tourist destinations across Bangladesh.
          </p>
        </header>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search places..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-6 py-3 sm:py-4 bg-white border-2 border-teal-200 rounded-2xl focus:outline-none focus:border-teal-500 transition-colors duration-300 shadow-md hover:shadow-lg font-medium text-gray-700 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-semibold">Loading amazing places...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8 px-6 bg-red-50 border-2 border-red-200 rounded-2xl max-w-md mx-auto">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-red-700 font-semibold text-lg mb-2">Error Loading Places</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Places Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredPlaces.slice(0, displayCount).map((place) => (
                <TouristPlaceCard key={place._id} place={place} />
              ))}
            </div>

            {/* No Results */}
            {filteredPlaces.length === 0 && (
              <div className="text-center py-12">
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-gray-600 font-semibold text-lg">No places found</p>
                <p className="text-gray-500 text-sm mt-2">Try searching with different keywords</p>
              </div>
            )}

            {/* Load More Button */}
            {displayCount < filteredPlaces.length && (
              <div className="flex justify-center mt-10 sm:mt-14">
                <button
                  onClick={() => setDisplayCount(displayCount + 4)}
                  className="px-8 py-3 sm:py-4 bg-linear-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-0.5 transform text-sm sm:text-base"
                >
                  Load More Places →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default TouristPlaceList;
