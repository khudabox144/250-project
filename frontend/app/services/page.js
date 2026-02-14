import React from 'react';

const Services = () => {
  const services = [
    {
      title: "Handpicked Destinations",
      description: "We curate the most beautiful and culturally rich locations across Bangladesh, from Sylhet's tea gardens to the Sundarbans.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Expert Local Guides",
      description: "Our certified local guides don't just show you sights; they tell you the stories and secrets only locals know.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Seamless Booking",
      description: "Manage your trips, view itineraries, and secure your spot with our easy-to-use digital booking system.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "24/7 Travel Support",
      description: "From the moment you book until you return home, our support team is available to assist you at every step.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">Why Choose Us</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            We provide the best <span className="text-blue-600">Travel Experience</span>
          </h3>
          <p className="text-slate-500 text-lg">
            Beyond just tour packages, we offer end-to-end services that ensure your safety, 
            comfort, and an unforgettable journey through Bangladesh.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-3xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h4>
              <p className="text-slate-500 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA (Optional) */}
        <div className="mt-16 text-center bg-slate-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to start your next adventure?</h4>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">Join thousands of travelers who have explored the beauty of the world with our expert planning.</p>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-blue-900/20">
              Explore All Packages
            </button>
          </div>
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>
        
      </div>
    </section>
  );
};

export default Services;