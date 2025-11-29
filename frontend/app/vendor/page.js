"use client";
import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';

const VendorDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [pRes, tRes] = await Promise.all([
          axiosClient.get('/users/me/packages'),
          axiosClient.get('/users/me/tours')
        ]);
        setPackages(pRes.data.data || []);
        setTours(tRes.data.data || []);
      } catch (err) {
        console.error('Vendor dashboard load error', err);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="p-8">Loading vendor dashboard...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
      <section className="mb-6">
        <h2 className="text-lg font-semibold">My Packages</h2>
        {packages.length === 0 ? <div className="text-gray-600">No packages yet.</div> : (
          <ul className="space-y-2 mt-2">{packages.map(p => <li key={p._id} className="border p-3 rounded">{p.title || p.name} — {p.isApproved ? 'Approved' : 'Pending'}</li>)}</ul>
        )}
      </section>
      <section>
        <h2 className="text-lg font-semibold">My Tour Submissions</h2>
        {tours.length === 0 ? <div className="text-gray-600">No submissions yet.</div> : (
          <ul className="space-y-2 mt-2">{tours.map(t => <li key={t._id} className="border p-3 rounded">{t.name} — {t.isApproved ? 'Approved' : 'Pending'}</li>)}</ul>
        )}
      </section>
    </div>
  );
};

export default VendorDashboard;
