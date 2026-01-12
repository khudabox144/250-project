"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyBookings } from "../utils/Booking_CRUD";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        setLoading(true);
        const resp = await getMyBookings(token);
        // getMyBookings returns an object or array depending on util; handle both
        const data = resp && resp.data ? resp.data : resp;
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load bookings', err);
        setError(err?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  if (loading) return <div className="p-8">Loading your bookings...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
        {bookings.length === 0 ? (
          <div className="p-6 bg-white rounded-lg shadow">You have no bookings yet.</div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b._id} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
                <div>
                  <div className="font-semibold">{b.package?.name || 'Package'}</div>
                  <div className="text-sm text-gray-600">Date: {new Date(b.bookingDate).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-600">Participants: {b.participants}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">৳{b.totalPrice}</div>
                  <div className="text-sm text-gray-500">Status: {b.status}</div>
                  <a href={`/packages/${b.package?._id || b.package}`} className="text-sm text-blue-600 underline block mt-2">View package</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
