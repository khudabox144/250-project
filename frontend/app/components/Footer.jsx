import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-400/25 transition-all duration-300">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                TravelBD
              </span>
            </Link>
            <p className="text-gray-300 leading-relaxed max-w-md mb-6">
              Discover the hidden treasures of Bangladesh with our curated travel experiences. 
              From pristine beaches to lush green hills, we bring you the best of what this beautiful country has to offer.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              {[
                { name: 'Facebook', icon: '📘', url: '#' },
                { name: 'Instagram', icon: '📷', url: '#' },
                { name: 'Twitter', icon: '🐦', url: '#' },
                { name: 'YouTube', icon: '📺', url: '#' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 bg-white/10 hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-cyan-300">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'All Tours', href: '/tours' },
                { name: 'Tourist Places', href: '/places' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'My Bookings', href: '/bookings' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-cyan-300 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-cyan-300">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">📍</span>
                </div>
                <p className="text-gray-300 text-sm">
                  123 Travel Street<br />
                  Dhaka, Bangladesh
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">📞</span>
                </div>
                <p className="text-gray-300 text-sm">+880 1XXX-XXXXXX</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✉️</span>
                </div>
                <p className="text-gray-300 text-sm">info@travelbd.com</p>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-cyan-200">Stay Updated</h4>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:-translate-y-0.5">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-gray-700">
          {[
            { icon: '🚀', title: 'Easy Booking', desc: 'Simple & fast reservation' },
            { icon: '🛡️', title: 'Safe Travel', desc: '100% safety guaranteed' },
            { icon: '💰', title: 'Best Price', desc: 'Competitive pricing' },
            { icon: '🌟', title: '5 Star Rating', desc: '2000+ happy travelers' },
          ].map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl">{feature.icon}</span>
              </div>
              <h4 className="font-semibold text-cyan-200 mb-1">{feature.title}</h4>
              <p className="text-gray-400 text-xs">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>
                © {new Date().getFullYear()} TravelBD. All rights reserved. | 
                Made with <span className="text-red-400">❤️</span> for travelers
              </p>
            </div>
            
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-cyan-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-cyan-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-cyan-300 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-110">
          <div className="flex items-center space-x-2">
            <span className="text-lg">💬</span>
            <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Need Help?
            </span>
          </div>
        </button>
      </div>
    </footer>
  );
};

export default Footer;