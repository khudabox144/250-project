"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking, getMyBookings } from '../utils/Booking_CRUD';

const PackageDetailView = ({ item }) => {
  const [imageErrors, setImageErrors] = useState({});
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(null);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) return;
        const resp = await getMyBookings(token);
        const data = resp && resp.data ? resp.data : resp;
        if (Array.isArray(data)) {
          const found = data.find(b => (b.package?._id || b.package) == item._id && ['pending', 'confirmed'].includes(b.status));
          setHasActiveBooking(!!found);
        }
      } catch (err) {
        console.error('Failed to check existing bookings', err);
      }
    };
    check();
  }, [item._id]);

  if (!item) return <div className="p-20 text-center font-bold text-slate-500">No package details found.</div>;

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    const cleanImg = img.replace(/^\//, '');
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}/uploads/${cleanImg}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO GALLERY - RESPONSIVE (Max 3 Images) */}
      <section className="relative h-[50vh] md:h-[65vh] bg-slate-100">
        <div className="flex h-full w-full flex-col md:flex-row gap-1 p-1 md:p-2">
          
          {/* Main Large Image (Image 1) */}
          <div className="relative flex-1 h-full overflow-hidden md:rounded-l-2xl">
            {!imageErrors[0] && item.images?.[0] ? (
              <img 
                src={getImageUrl(item.images[0])} 
                className="w-full h-full object-cover transition duration-500 hover:scale-105"
                onError={() => setImageErrors(p => ({...p, 0: true}))}
                alt="Main"
              />
            ) : <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center">Image 1</div>}
            {/* Overlay for mobile title readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
          </div>

          {/* Side Images (Images 2 & 3) - Hidden on smallest mobile, shown as column on desktop */}
          <div className="hidden md:flex flex-col w-1/3 h-full gap-1 md:gap-2">
            {[1, 2].map((idx) => (
              <div key={idx} className={`relative flex-1 overflow-hidden ${idx === 1 ? 'md:rounded-tr-2xl' : 'md:rounded-br-2xl'}`}>
                {!imageErrors[idx] && item.images?.[idx] ? (
                  <img 
                    src={getImageUrl(item.images[idx])} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                    onError={() => setImageErrors(p => ({...p, idx: true}))}
                    alt={`View ${idx}`}
                  />
                ) : <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">Image {idx + 1}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Floating Tags */}
        <div className="absolute bottom-6 left-6 z-10 flex gap-2">
           <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
             📍 {item.district?.name || item.district}
           </span>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          
          {/* LEFT SIDE: Package Info */}
          <div className="flex-1 order-2 lg:order-1">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
              {item.name || item.title}
            </h1>
            
            <p className="text-slate-600 text-lg leading-relaxed mb-10 border-l-4 border-blue-600 pl-4">
              {item.description}
            </p>

            {/* THE JOURNEY (Dynamic from Form) */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="bg-blue-600 w-2 h-8 rounded-full"></span>
                The Journey
              </h2>
              
              <div className="space-y-2">
                {item.itinerary && item.itinerary.length > 0 ? (
                  item.itinerary.map((day, idx) => (
                    <div key={idx} className="relative pl-10 pb-10 border-l-2 border-slate-100 last:border-0 ml-4">
                      {/* Circle indicator */}
                      <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-blue-600 shadow-sm" />
                      
                      <div className="bg-slate-50 rounded-2xl p-5 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all border border-transparent hover:border-slate-100">
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Day {idx + 1}</span>
                        <h3 className="text-xl font-bold text-slate-800 mt-1 mb-2">
                          {day.title || `Exploring Site ${idx + 1}`}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {day.description}
                        </p>
                        
                        {/* Activities Chips */}
                        {day.activities?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {day.activities.map((act, i) => (
                              <span key={i} className="bg-white border border-slate-200 text-slate-500 text-[11px] px-2 py-1 rounded-md font-medium">
                                • {act}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No itinerary details provided.</p>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT SIDE: Responsive Sticky Sidebar */}
          <aside className="lg:w-[380px] order-1 lg:order-2">
            <div className="lg:sticky lg:top-8 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xl shadow-slate-100">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Starting at</span>
                  <p className="text-3xl font-black text-slate-900">{formatCurrency(item.price)}</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl text-center">
                  <p className="text-lg font-bold leading-none">{item.duration}</p>
                  <p className="text-[10px] uppercase font-bold opacity-70">Days</p>
                </div>
              </div>

              <button 
                onClick={async () => {
                   setBookingLoading(true);
                   // ... (your existing booking logic)
                }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 transition-all transform active:scale-[0.98]"
              >
                {hasActiveBooking ? "Booking Pending" : "Book This Experience"}
              </button>

              {/* Package Meta Info */}
              <div className="mt-8 space-y-4 border-t border-slate-50 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2">🏔️ Difficulty</span>
                  <span className="font-bold text-slate-800 capitalize">{item.difficulty || 'Easy'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2">👥 Group Size</span>
                  <span className="font-bold text-slate-800">Max {item.groupSize || '10'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2">🚐 Transport</span>
                  <span className="font-bold text-slate-800">{item.transport || 'Private'}</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default PackageDetailView;