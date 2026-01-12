"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createBooking } from '../utils/Booking_CRUD';

const BookingModal = ({ isOpen, onClose, packageItem }) => {
  const [formData, setFormData] = useState({
    bookingDate: '',
    participants: 1,
    contactPhone: '',
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
        setFormData({
            bookingDate: '',
            participants: 1,
            contactPhone: '',
            specialRequests: ''
        });
        setError(null);
        setSuccess(false);
    }
  }, [isOpen]);

  // don't attempt to render on server
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  useEffect(() => {
    console.log('BookingModal isOpen ->', isOpen);
  }, [isOpen]);

  if (!isBrowser) return null;
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('accessToken');
    if (!token) {
        setError("You must be logged in to book.");
        setLoading(false);
        return;
    }

    // Coerce types before sending
    const payload = {
      packageId: packageItem?._id || packageItem?.id,
      bookingDate: formData.bookingDate,
      participants: Number(formData.participants),
      contactPhone: (formData.contactPhone || '').trim(),
      specialRequests: formData.specialRequests || ''
    };

    try {
      // Debug: log payload and token to help trace failing requests
      console.log('📤 Booking submit', {
        apiBase: process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'http://localhost:5000/api',
        payload,
        token: token ? `${token.substring(0, 8)}...` : null,
      });

      await createBooking(payload, token);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      // Log full error for debugging
      console.error('❌ Booking error (modal):', err);
      // Show enriched message if available
      const msg = (err && (err.message || err.data?.message || JSON.stringify(err))) || 'Booking failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const participantsNum = Number(formData.participants) || 0;
  const totalCost = (Number(packageItem?.price) || 0) * participantsNum;

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50">
          <button
            onClick={onClose}
            aria-label="Close booking modal"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-50"
          >
            ✕
          </button>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Book {packageItem.name}
                </h3>
                
                {success ? (
                    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                        Booking successful! Redirecting...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                      {error && (
                          <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>
                      )}

                      <div>
                        <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                          type="date"
                          name="bookingDate"
                          id="bookingDate"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.bookingDate}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="participants" className="block text-sm font-medium text-gray-700">Participants</label>
                        <input
                          type="number"
                          name="participants"
                          id="participants"
                          min="1"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.participants}
                          onChange={handleChange}
                        />
                      </div>

                       <div>
                        <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          name="contactPhone"
                          id="contactPhone"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.contactPhone}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">Special Requests (Optional)</label>
                        <textarea
                          name="specialRequests"
                          id="specialRequests"
                          rows="3"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.specialRequests}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                          <span className="font-semibold text-gray-700">Total Cost:</span>
                          <span className="text-xl font-bold text-green-600">৳{totalCost}</span>
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                        >
                          {loading ? 'Booking...' : 'Confirm Booking'}
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default BookingModal;
