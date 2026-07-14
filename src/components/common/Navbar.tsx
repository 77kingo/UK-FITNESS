import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Dumbbell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

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
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-gray-900" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="UK Fitness Homepage">
            <div className="bg-brand-neon p-2 rounded-lg text-brand-dark group-hover:scale-105 transition-transform duration-300">
              <Dumbbell className="h-6 w-6 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-2xl tracking-wider text-white group-hover:text-brand-neon transition-colors duration-300">
              UK <span className="text-brand-neon">FITNESS</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium tracking-wide transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-brand-neon border-b-2 border-brand-neon pb-1'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className={`font-medium tracking-wide transition-colors duration-300 ${
                  isActive('/admin') ? 'text-brand-neon' : 'text-gray-400 hover:text-white'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth CTA / User Controls */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 bg-brand-accent px-4 py-2 rounded-md hover:bg-gray-800 border border-gray-800 transition-all duration-300"
                  aria-label="View member profile"
                >
                  <User className="h-4 w-4 text-brand-neon" />
                  <span className="text-sm font-medium text-white">{user.fullName}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 text-sm font-medium transition-colors py-2 px-1 focus:ring-1 focus:ring-red-500 rounded"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-brand-neon text-brand-dark px-5 py-2.5 rounded-md font-semibold text-sm hover:shadow-neon-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-neon rounded-md p-2"
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
        <div className="md:hidden bg-brand-dark border-b border-gray-900 px-4 pt-2 pb-6 space-y-4" id="mobile-menu">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-semibold ${
                isActive(link.path)
                  ? 'bg-brand-accent text-brand-neon'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-semibold ${
                isActive('/admin') ? 'bg-brand-accent text-brand-neon' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-gray-900">
            {user ? (
              <div className="space-y-3">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5"
                >
                  <User className="h-5 w-5 text-brand-neon" />
                  <span className="text-white font-medium">{user.fullName}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 w-full text-left text-red-400 hover:bg-red-500/10 rounded-md font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsOpen(false);
                }}
                className="w-full bg-brand-neon text-brand-dark px-4 py-2.5 rounded-md font-semibold text-center block"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
