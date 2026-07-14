import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  onOpenAuth?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  onOpenAuth,
}) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-brand-neon border-brand-accent rounded-full animate-spin" />
          <p className="text-gray-400 font-medium animate-pulse">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  // User is not authenticated
  if (!user) {
    // If there is an auth modal toggle provided, we can trigger it
    if (onOpenAuth) {
      onOpenAuth();
    }
    // Redirect to home page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // User's role is not in the allowed list
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
