import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from './Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    if (!email || !password || (isSignUp && !fullName)) {
      setFormError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign up logic.
        // Quick check: if the name or email contains 'admin', sign up as an admin role
        const role = email.toLowerCase().includes('admin') ? 'admin' : 'member';
        const success = await signup(email, password, fullName, role);
        if (success) {
          onClose();
        } else {
          setFormError('Failed to sign up. Check console or credentials.');
        }
      } else {
        // Log in logic
        const success = await login(email, password);
        if (success) {
          onClose();
        } else {
          setFormError('Invalid email or password. Hint: type "admin@ukfitness.com" to test as Admin.');
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'An authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Card container */}
      <div className="glass-card relative max-w-md w-full bg-brand-card rounded-2xl border border-gray-800 p-6 md:p-8 shadow-2xl focus:outline-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors focus:ring-2 focus:ring-brand-neon"
          aria-label="Close authentication modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 text-center">
          <h2 id="auth-modal-title" className="text-3xl font-extrabold text-white">
            {isSignUp ? 'Join UK FITNESS' : 'Welcome Back'}
          </h2>
          <p className="text-gray-400 text-sm mt-1.5">
            {isSignUp ? 'Create your profile to book classes' : 'Sign in to access your membership'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-md p-3 text-sm font-medium">
              {formError}
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5" htmlFor="full-name">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  id="full-name"
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 pl-10 pr-4 text-white text-sm focus:border-brand-neon focus:ring-1 focus:ring-brand-neon focus:outline-none"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5" htmlFor="email-input">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email-input"
                type="email"
                placeholder="you@example.com"
                className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 pl-10 pr-4 text-white text-sm focus:border-brand-neon focus:ring-1 focus:ring-brand-neon focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5" htmlFor="password-input">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password-input"
                type="password"
                placeholder="••••••••"
                className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 pl-10 pr-4 text-white text-sm focus:border-brand-neon focus:ring-1 focus:ring-brand-neon focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            {isSignUp ? 'Create Profile' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          </span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setFormError(null);
            }}
            className="text-brand-neon hover:underline font-bold transition-all focus:outline-none"
          >
            {isSignUp ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
