import React from 'react';
import { PackageCheck, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import ScrollToTopLink from './ScrollToTopLink';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <PackageCheck className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">PackPal</span>
              </div>
              <p className="text-gray-400">Making event organization simple and efficient.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><ScrollToTopLink to="/" className="text-gray-400 hover:text-white transition-colors">Home</ScrollToTopLink></li>
                <li><ScrollToTopLink to="/features" className="text-gray-400 hover:text-white transition-colors">Features</ScrollToTopLink></li>
                <li><ScrollToTopLink to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</ScrollToTopLink></li>
                <li><ScrollToTopLink to="/about" className="text-gray-400 hover:text-white transition-colors">About</ScrollToTopLink></li>
                <li><ScrollToTopLink to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</ScrollToTopLink></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><ScrollToTopLink to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</ScrollToTopLink></li>
                <li><ScrollToTopLink to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</ScrollToTopLink></li>
                <li><ScrollToTopLink to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</ScrollToTopLink></li>
                <li><ScrollToTopLink to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</ScrollToTopLink></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} PackPal. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 