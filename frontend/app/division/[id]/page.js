"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axiosClient from '../../utils/axiosClient';
import Link from 'next/link';

const DivisionPage = () => {
  const params = useParams();
  const id = params?.id; // division id
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/districts/division/${id}`);
        setDistricts(res.data.data || res.data || []);
      } catch (err) {
        console.error('Failed to load districts for division', err);
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-8">Loading districts...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Districts</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {districts.map(d => (
          <Link key={d._id} href={`/district/${d._id}`} className="border rounded p-4 block hover:shadow">
            <div className="font-semibold">{d.name}</div>
            <div className="text-sm text-gray-600">Click to view tours</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DivisionPage;
