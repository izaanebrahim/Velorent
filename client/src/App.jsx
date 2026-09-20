import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/layout/AdminSidebar';

// Page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Vehicles from './pages/Vehicles';
import VehicleDetails from './pages/VehicleDetails';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import BookingHistory from './pages/BookingHistory';

// Admin components
import AdminDashboard from './pages/admin/Dashboard';
import ManageVehicles from './pages/admin/ManageVehicles';
import ManageUsers from './pages/admin/ManageUsers';
import Reports from './pages/admin/Reports';

// Protected Route Wrapper for Customers/Renters
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return children;
};

// Admin Protected Route Wrapper
const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-main text-primary font-bold animate-pulse text-sm">
        Verifying administrative authorization...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// Public & Renter Layout
function RenterLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-main text-white font-main">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Admin Layout
function AdminLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bg-main text-white font-main">
      <AdminSidebar />
      <main className="flex-grow p-6 md:p-12 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

// Main App Router Component
function AppRoutes() {
  return (
    <Routes>
      {/* Renter & Public Routes */}
      <Route element={<RenterLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/:id" element={<VehicleDetails />} />
        
        {/* Protected Routes */}
        <Route path="/booking/:vehicleId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
      </Route>

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="vehicles" element={<ManageVehicles />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#111827',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#00dc82',
                secondary: '#000',
              },
            },
          }}
        />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
