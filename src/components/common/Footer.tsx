import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Instagram, Facebook, Twitter, MapPin, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark/50 border-t border-gray-900 pt-16 pb-8" aria-label="Gym footer information">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2" aria-label="UK Fitness Homepage">
              <div className="bg-brand-neon p-1.5 rounded text-brand-dark">
                <Dumbbell className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl tracking-wider text-white">
                UK <span className="text-brand-neon">FITNESS</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              We provide state-of-the-art training spaces, premium high-octane coaching, and recovery solutions designed to unleash your athletic capabilities.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2 bg-brand-accent hover:bg-brand-neon hover:text-brand-dark text-gray-400 rounded-md transition-all duration-300" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-brand-accent hover:bg-brand-neon hover:text-brand-dark text-gray-400 rounded-md transition-all duration-300" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-brand-accent hover:bg-brand-neon hover:text-brand-dark text-gray-400 rounded-md transition-all duration-300" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base tracking-wide uppercase mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-brand-neon transition-colors text-sm">Home</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-brand-neon transition-colors text-sm">Services & Classes</Link>
              </li>
              <li>
                <Link to="/schedule" className="text-gray-400 hover:text-brand-neon transition-colors text-sm">Class Schedule</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-base tracking-wide uppercase mb-4">Club Hours</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Mon - Fri:</span>
                <span className="text-white">05:30 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span className="text-white">07:00 - 20:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-white">08:00 - 18:00</span>
              </li>
            </ul>
          </div>

          {/* Location / Info */}
          <div>
            <h3 className="text-white font-bold text-base tracking-wide uppercase mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-brand-neon shrink-0 mt-0.5" />
                <span>Bhimdatta 10400, Sudurpashchim Province, Nepal</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-neon shrink-0" />
                <span>+977 970-7159761</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-neon shrink-0" />
                <span>info@ukfitnessnepal.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} UK FITNESS Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Accessibility Statement (WCAG 2.1 AA)</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
