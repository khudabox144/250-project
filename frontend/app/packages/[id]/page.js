"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTourPackageById } from '@/app/utils/TourPackage_CRUD'; 
import PackageDetailView from '../../components/PackageDetailView';

const PackageDetailsPage = () => {
  const params = useParams();
  const id = params?.id;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const loadPackage = async () => {
      setLoading(true);
      setError(null);
      try {
        const packageData = await getTourPackageById(id);
        setItem(packageData.data || packageData);
      } catch (err) {
        console.error('Failed to load package details', err);
        setError('Failed to load package details. Please try again.');
      } finally { 
        setLoading(false); 
      }
    };
    
    loadPackage();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading package details...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
  
  if (!item) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-600 text-lg">Package not found.</div>
      </div>
    </div>
  );
  
  return <PackageDetailView item={item} />;
};

export default PackageDetailsPage;