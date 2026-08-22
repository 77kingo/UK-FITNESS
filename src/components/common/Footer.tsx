import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Instagram, Facebook, Twitter, MapPin, Mail, Phone, ArrowRight, Check } from 'lucide-react';
import { Button } from './Button';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3500);
    }
  };

  return (
    <footer className="bg-brand-dark/70 border-t border-gray-900 pt-16 pb-10" aria-label="Gym footer information">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group" aria-label="UK Fitness Homepage">
              <div className="bg-brand-neon p-2 rounded-xl text-brand-dark group-hover:scale-105 transition-transform shadow-neon-glow">
                <Dumbbell className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="font-black text-2xl tracking-wider text-white">
                UK <span className="text-brand-neon">FITNESS</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              We provide Olympic-grade training spaces, high-octane group conditioning, calibrated Eleiko lift stations, and cold recovery facilities designed to unleash your athletic peak.
            </p>

            {/* Newsletter form */}
            <form onSubmit={handleSubscribe} className="pt-2 max-w-md">
              <span className="text-[11px] font-black text-brand-neon uppercase tracking-wider block mb-1.5">
                Join Athlete Intel & WOD Alerts
              </span>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-brand-neon focus:outline-none flex-1 font-medium"
                />
                <Button type="submit" variant="primary" size="sm" className="font-black shrink-0 px-4">
                  {subscribed ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
              {subscribed && (
                <span className="text-[11px] text-brand-neon font-bold mt-1 block animate-fadeIn">
                  ✓ You are on the Athlete VIP dispatch list!
                </span>
              )}
            </form>

            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2.5 bg-brand-accent hover:bg-brand-neon hover:text-brand-dark text-gray-400 rounded-xl transition-all duration-300 shadow-md" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2.5 bg-brand-accent hover:bg-brand-neon hover:text-brand-dark text-gray-400 rounded-xl transition-all duration-300 shadow-md" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2.5 bg-brand-accent hover:bg-brand-neon hover:text-brand-dark text-gray-400 rounded-xl transition-all duration-300 shadow-md" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-black text-sm tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-gray-400 hover:text-brand-neon transition-colors text-sm font-medium">Home</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-brand-neon transition-colors text-sm font-medium">Services & Memberships</Link>
              </li>
              <li>
                <Link to="/schedule" className="text-gray-400 hover:text-brand-neon transition-colors text-sm font-medium">Class Schedule</Link>
              </li>
              <li>
                <Link to="/tools" className="text-gray-400 hover:text-brand-neon transition-colors text-sm font-medium flex items-center gap-1.5">
                  <span>Fitness Suite Hub</span>
                  <span className="bg-brand-neon/20 text-brand-neon text-[9px] font-black px-1.5 py-0.5 rounded">NEW</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-black text-sm tracking-wider uppercase mb-4">Club Hours</h3>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li className="flex justify-between py-1 border-b border-gray-800/60">
                <span>Mon - Fri:</span>
                <span className="text-white font-bold">05:30 - 22:00</span>
              </li>
              <li className="flex justify-between py-1 border-b border-gray-800/60">
                <span>Saturday:</span>
                <span className="text-white font-bold">07:00 - 20:00</span>
              </li>
              <li className="flex justify-between py-1">
                <span>Sunday:</span>
                <span className="text-white font-bold">08:00 - 18:00</span>
              </li>
            </ul>
          </div>

          {/* Location / Info */}
          <div>
            <h3 className="text-white font-black text-sm tracking-wider uppercase mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-xs text-gray-400 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand-neon shrink-0 mt-0.5" />
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

        <div className="border-t border-gray-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} UK FITNESS Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Accessibility (WCAG 2.1 AA)</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
