"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axiosClient from '../../utils/axiosClient';
import Link from 'next/link';

const DistrictPage = () => {
  const params = useParams();
  const id = params?.id; // district id
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get('/tours', { params: { district: id } });
        setTours(res.data.data || res.data || []);
      } catch (err) {
        console.error('Failed to load tours for district', err);
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-8">Loading tours...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tours in district</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tours.map(t => (
          <div key={t._id} className="border rounded p-4">
            <h3 className="font-semibold">{t.name}</h3>
            <p className="text-sm text-gray-600">{t.description?.slice(0,120)}</p>
            <Link href={`/tours/${t._id}`} className="inline-block mt-3 text-blue-600">View details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistrictPage;
