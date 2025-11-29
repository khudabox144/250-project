"use client";
import React, { useEffect, useState } from 'react';
import axiosClient from '../../utils/axiosClient';
import Link from 'next/link';
import Link from 'next/link';

const AdminToursPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/pending/tours');
      setTours(res.data.data || []);
    } catch (err) {
      console.error('Failed to load pending tours', err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => { await axiosClient.patch(`/admin/tour/${id}/approve`); await load(); };
  const handleReject = async (id) => { await axiosClient.patch(`/admin/tour/${id}/reject`); await load(); };

  if (loading) return <div className="p-8">Loading pending tours...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Pending Tour Places</h1>
      <div className="space-y-4">
        {tours.map(t => (
          <div key={t._id} className="p-4 border rounded flex items-start">
            <div className="flex-1">
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-600">{t.description?.slice(0,120)}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleApprove(t._id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
              <button onClick={() => handleReject(t._id)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminToursPage;
