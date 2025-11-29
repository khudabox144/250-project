"use client";
import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import Link from 'next/link';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [pendingTours, setPendingTours] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sRes, pRes, uRes] = await Promise.all([
        axiosClient.get('/admin/dashboard'),
        axiosClient.get('/admin/pending/tours'),
        axiosClient.get('/admin/users'),
      ]);

      setSummary(sRes.data.data || null);
      setPendingTours(pRes.data.data || []);
      setUsers(uRes.data.data || []);
    } catch (err) {
      console.error('Admin load error', err);
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleApproveTour = async (id) => {
    if (!confirm('Approve this tour?')) return;
    try {
      setActionLoading(true);
      await axiosClient.patch(`/admin/tour/${id}/approve`);
      await loadData();
    } catch (err) {
      console.error('Approve error', err);
      alert('Approve failed');
    } finally { setActionLoading(false); }
  };

  const handleRejectTour = async (id) => {
    if (!confirm('Reject this tour?')) return;
    try {
      setActionLoading(true);
      await axiosClient.patch(`/admin/tour/${id}/reject`);
      await loadData();
    } catch (err) {
      console.error('Reject error', err);
      alert('Reject failed');
    } finally { setActionLoading(false); }
  };

  if (loading) return <div className="p-8">Loading admin dashboard...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded">Users: <strong>{summary?.totalUsers}</strong></div>
        <div className="p-4 border rounded">Tours: <strong>{summary?.totalTours}</strong> (Pending: {summary?.pendingTours})</div>
        <div className="p-4 border rounded">Packages: <strong>{summary?.totalPackages}</strong> (Pending: {summary?.pendingPackages})</div>
      </div>

      <div className="flex items-center space-x-3 mb-6">
        <Link href="/admin/tours" className="px-3 py-2 bg-blue-600 text-white rounded">View All Pending Tours</Link>
        <Link href="/admin/packages" className="px-3 py-2 bg-blue-600 text-white rounded">View All Pending Packages</Link>
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pending Tour Places</h2>
        {pendingTours.length === 0 && <div className="text-gray-600">No pending tours.</div>}
        <div className="space-y-4">
          {pendingTours.map(t => (
            <div key={t._id} className="p-4 border rounded flex items-start space-x-4">
              <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                {t.images && t.images[0] ? (
                  <img src={`${process.env.NEXT_PUBLIC_SERVER_BASE_URL.replace('/api','')}/${t.images[0]}`} alt="img" className="w-full h-full object-cover" />
                ) : <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No image</div>}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-gray-600">Created: {new Date(t.createdAt).toLocaleString()}</div>
                <div className="mt-2 space-x-2">
                  <button disabled={actionLoading} onClick={() => handleApproveTour(t._id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                  <button disabled={actionLoading} onClick={() => handleRejectTour(t._id)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Recent Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summary?.recentUsers?.map(u => (
            <div key={u._id} className="p-3 border rounded">
              <div className="font-semibold">{u.name || u.email}</div>
              <div className="text-sm text-gray-600">{u.email}</div>
              <div className="text-xs text-gray-500">Role: {u.role}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
