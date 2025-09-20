import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold">Explore My Kerala</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Discover the beauty of God's Own Country with our curated travel experiences. 
              From serene backwaters to misty hill stations, we bring you the best of Kerala.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-green-400 transition-colors">Home</a></li>
              <li><a href="/packages" className="text-gray-300 hover:text-green-400 transition-colors">Packages</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-green-400 transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-green-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">info@exploremykerala.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-400 mt-1" />
                <span className="text-gray-300">
                  Kochi, Kerala, India<br />
                  Pin: 682001
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Explore My Kerala. All rights reserved. | 
            <a href="/privacy" className="hover:text-green-400 transition-colors ml-1">Privacy Policy</a> | 
            <a href="/terms" className="hover:text-green-400 transition-colors ml-1">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
