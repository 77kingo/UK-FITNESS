import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Schedule } from './pages/Schedule';
import { MemberProfile } from './pages/MemberProfile';
import { AdminDashboard } from './pages/AdminDashboard';

export const App: React.FC = () => {
  const { initialize, loading } = useAuthStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleOpenAuth = () => setIsAuthOpen(true);
  const handleCloseAuth = () => setIsAuthOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Gym Load spinner */}
          <div className="w-16 h-16 border-4 border-t-brand-neon border-brand-accent rounded-full animate-spin" />
          <h2 className="text-xl font-bold tracking-wider text-white uppercase animate-pulse">UK FITNESS</h2>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-brand-dark text-white selection:bg-brand-neon selection:text-brand-dark">
        {/* Navbar */}
        <Navbar onOpenAuth={handleOpenAuth} />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onOpenAuth={handleOpenAuth} />} />
            <Route path="/services" element={<Services onOpenAuth={handleOpenAuth} />} />
            <Route path="/schedule" element={<Schedule onOpenAuth={handleOpenAuth} />} />
            
            {/* Guarded Member Dashboard */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute onOpenAuth={handleOpenAuth} allowedRoles={['member', 'admin']}>
                  <MemberProfile />
                </ProtectedRoute>
              }
            />

            {/* Guarded Admin Dashboard */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute onOpenAuth={handleOpenAuth} allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Access Auth Modal */}
        <AuthModal isOpen={isAuthOpen} onClose={handleCloseAuth} />
      </div>
    </BrowserRouter>
  );
};
export default App;
