"use client";
import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';

const AllDestinationPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosClient.get('/tours');
        setTours(res.data.data || res.data || []);
      } catch (err) {
        console.error('Failed to load tours', err);
        setError('Failed to load destinations');
      } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="p-8">Loading destinations...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">All Destinations</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tours.map(t => (
          <div key={t._id} className="border rounded p-4">
            <h3 className="font-semibold">{t.name}</h3>
            <p className="text-sm text-gray-600">{t.description?.slice(0,120)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllDestinationPage;
