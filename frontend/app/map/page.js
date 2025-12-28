"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100">Loading Map...</div>
});

const MapPage = () => {
    // Example markers - you can replace this with data fetched from your API
    const markers = useMemo(() => [
        { position: [23.8103, 90.4125], content: "Dhaka" },
        { position: [22.3569, 91.7832], content: "Chittagong" },
        { position: [24.8949, 91.8687], content: "Sylhet" },
        { position: [21.4272, 92.0058], content: "Cox's Bazar" },
    ], []);

    return (
        <div className="container mx-auto p-4 flex flex-col gap-4 h-screen">
            <h1 className="text-2xl font-bold mb-4">Tour Map</h1>
            <div className="flex-1 w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200" style={{ minHeight: "500px" }}>
                <MapComponent markers={markers} zoom={7} />
            </div>
             <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                    Explore different tour destinations on the map. Click on markers to see more details.
                </p>
            </div>
        </div>
    );
};

export default MapPage;