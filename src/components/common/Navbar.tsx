import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Dumbbell, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from './Button';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => location.pathname === path;

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Fitness Hub', path: '/tools', badge: 'Tools' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark/85 backdrop-blur-xl border-b border-gray-900/90 shadow-2xl" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Live Status */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group" aria-label="UK Fitness Homepage">
              <div className="bg-brand-neon p-2.5 rounded-xl text-brand-dark group-hover:scale-105 transition-all duration-300 shadow-neon-glow">
                <Dumbbell className="h-6 w-6 stroke-[2.5]" />
              </div>
              <span className="font-black text-2xl tracking-wider text-white group-hover:text-brand-neon transition-colors duration-300">
                UK <span className="text-brand-neon">FITNESS</span>
              </span>
            </Link>

            {/* Live Status Badge */}
            {(() => {
              const now = new Date();
              const day = now.getDay();
              const hour = now.getHours();
              const isOpenNow = day !== 6 && hour >= 6 && hour < 21;
              const text = day === 6 ? 'Closed Saturday' : isOpenNow ? 'Open Now • Closes 9 PM' : 'Closed • Opens 6 AM';
              return (
                <div
                  className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase border transition-all ${
                    isOpenNow
                      ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.15)]'
                      : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-green-400 animate-pulse' : 'bg-orange-400'}`} />
                  <span>{text}</span>
                </div>
              );
            })()}
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-bold text-sm tracking-wider uppercase transition-all duration-300 py-1 ${
                  isActive(link.path)
                    ? 'text-brand-neon border-b-2 border-brand-neon'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {link.name}
                  {link.badge && (
                    <span className="bg-brand-neon/15 text-brand-neon text-[9px] font-black px-1.5 py-0.5 rounded-full border border-brand-neon/30">
                      {link.badge}
                    </span>
                  )}
                </span>
              </Link>
            ))}

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className={`font-bold text-sm tracking-wider uppercase transition-colors duration-300 ${
                  isActive('/admin') ? 'text-brand-neon border-b-2 border-brand-neon pb-1' : 'text-gray-400 hover:text-white'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth CTA / User Controls */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 bg-brand-accent/80 hover:bg-gray-800 px-4 py-2 rounded-xl border border-gray-800 hover:border-brand-neon/40 transition-all duration-300 shadow-md"
                  aria-label="View member profile"
                >
                  <User className="h-4 w-4 text-brand-neon" />
                  <span className="text-sm font-bold text-white">{user.fullName}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm font-bold transition-colors py-2 px-2 hover:bg-red-500/10 rounded-xl"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenAuth}
                className="font-black tracking-wider"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-neon rounded-xl p-2 bg-gray-900 border border-gray-800"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark/95 backdrop-blur-2xl border-b border-gray-900 px-4 pt-3 pb-6 space-y-3" id="mobile-menu">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider ${
                isActive(link.path)
                  ? 'bg-brand-neon text-brand-dark shadow-neon-glow'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] bg-brand-neon/20 text-brand-neon px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}

          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider ${
                isActive('/admin') ? 'bg-brand-accent text-brand-neon' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-3 border-t border-gray-900">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-900 text-white font-bold"
                >
                  <User className="h-5 w-5 text-brand-neon" />
                  <span>{user.fullName}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 rounded-xl font-bold"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  onOpenAuth();
                  setIsOpen(false);
                }}
                className="w-full justify-center py-3 font-black"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
