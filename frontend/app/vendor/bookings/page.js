"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getVendorBookings, updateBookingStatus } from "../../utils/Booking_CRUD";

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const router = useRouter();

  const load = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/auth/login');
      return;
    }
    try {
      setLoading(true);
      const resp = await getVendorBookings(token);
      const data = resp && resp.data ? resp.data : resp;
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load vendor bookings', err);
      setError(err?.message || 'Failed to load vendor bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id, status) => {
    const token = localStorage.getItem('accessToken');
    setActionLoading(id);
    try {
      await updateBookingStatus(id, { status }, token);
      await load();
    } catch (err) {
      console.error('Action failed', err);
      setError(err?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="p-8">Loading booking requests...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Vendor Booking Requests</h1>
        {bookings.length === 0 ? (
          <div className="p-6 bg-white rounded-lg shadow">No booking requests yet.</div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => {
              const isPending = b.status === 'pending';
              const statusColor = b.status === 'confirmed' ? 'bg-green-100 text-green-800' : b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
              return (
                <div key={b._id} className="p-4 bg-white rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{b.package?.name || 'Package'}</div>
                    <div className="text-sm text-gray-600">User: {b.user?.username || b.user?.email || 'User'}</div>
                    <div className="text-sm text-gray-600">Date: {new Date(b.bookingDate).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-600">Participants: {b.participants}</div>
                    {b.contactPhone && <div className="text-sm text-gray-600">Phone: {b.contactPhone}</div>}
                    {b.specialRequests && <div className="text-sm text-gray-600">Notes: {b.specialRequests}</div>}
                  </div>
                  <div className="mt-3 md:mt-0 md:ml-6 text-right flex-shrink-0">
                    <div className="font-bold text-green-600">৳{b.totalPrice}</div>
                    <div className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-sm ${statusColor}`}>{b.status}</div>
                    <div className="mt-3 flex gap-2 justify-end">
                      <button disabled={actionLoading===b._id || !isPending} onClick={() => handleAction(b._id, 'confirmed')} className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50">{actionLoading===b._id ? '...' : 'Approve'}</button>
                      <button disabled={actionLoading===b._id || !isPending} onClick={() => handleAction(b._id, 'cancelled')} className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50">{actionLoading===b._id ? '...' : 'Reject'}</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
