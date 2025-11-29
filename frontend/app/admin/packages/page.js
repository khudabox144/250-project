"use client";
import React, { useEffect, useState } from 'react';
import axiosClient from '../../utils/axiosClient';

const AdminPackagesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/pending/packages');
      setItems(res.data.data || []);
    } catch (err) {
      console.error('Failed to load pending packages', err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => { await axiosClient.patch(`/admin/package/${id}/approve`); await load(); };
  const handleReject = async (id) => { await axiosClient.patch(`/admin/package/${id}/reject`); await load(); };

  if (loading) return <div className="p-8">Loading pending packages...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Pending Packages</h1>
      <div className="space-y-4">
        {items.map(p => (
          <div key={p._id} className="p-4 border rounded flex items-start justify-between">
            <div>
              <div className="font-semibold">{p.title || p.name}</div>
              <div className="text-sm text-gray-600">{p.description?.slice(0,120)}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleApprove(p._id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
              <button onClick={() => handleReject(p._id)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPackagesPage;
