import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, User, LogOut, Menu, X, ChevronDown, History, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-bg-main/95 backdrop-blur-md border-b border-border-glass z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-text-main select-none">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Car className="w-5 h-5 text-bg-main stroke-[2.5]" />
          </div>
          <span className="tracking-tight">VeloRent</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link
            to="/vehicles"
            className={`transition-colors text-sm font-semibold ${
              isActive('/vehicles') ? 'text-primary' : 'text-text-muted hover:text-text-main'
            }`}
          >
            Vehicles
          </Link>
          <a
            href="#how-it-works"
            className="text-text-muted hover:text-text-main transition-colors text-sm font-semibold"
            onClick={(e) => {
              if (location.pathname !== '/') {
                e.preventDefault();
                navigate('/#how-it-works');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
          >
            How It Works
          </a>
          <Link
            to="/about"
            className="text-text-muted hover:text-text-main transition-colors text-sm font-semibold"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-text-muted hover:text-text-main transition-colors text-sm font-semibold"
          >
            Contact
          </Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-bg-secondary border border-border-glass hover:border-text-muted px-4 py-2 rounded-md text-sm cursor-pointer select-none transition-colors"
              >
                <User className="w-4 h-4 text-primary" />
                <span className="font-semibold text-text-main">{user?.name}</span>
                <ChevronDown className="w-3 h-3 text-text-muted" />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-bg-secondary rounded-lg border border-border-glass shadow-xl z-50 flex flex-col p-1">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text-main hover:bg-bg-main rounded-md transition-all font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text-main hover:bg-bg-main rounded-md transition-all font-medium"
                    >
                      <History className="w-4 h-4" />
                      My Bookings
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text-main hover:bg-bg-main rounded-md transition-all font-medium"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <div className="h-px bg-border-glass my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-md w-full text-left cursor-pointer transition-all font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="btn-glass px-5 py-2 text-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary px-5 py-2 text-sm">
                Book a Vehicle
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-text-main hover:text-primary transition-colors cursor-pointer p-2"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-bg-secondary border-b border-border-glass flex flex-col shadow-xl z-50 md:hidden">
          <div className="flex flex-col p-4 gap-1">
            <Link
              to="/vehicles"
              onClick={() => setMobileMenuOpen(false)}
              className="text-text-muted hover:text-text-main font-semibold transition-colors py-3 px-4 rounded-md hover:bg-bg-main"
            >
              Vehicles
            </Link>
            <a
              href="#how-it-works"
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/#how-it-works');
                  setTimeout(() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="text-text-muted hover:text-text-main font-semibold transition-colors py-3 px-4 rounded-md hover:bg-bg-main"
            >
              How It Works
            </a>

            {isAuthenticated ? (
              <div className="flex flex-col gap-1 pt-4 mt-2 border-t border-border-glass">
                <div className="text-sm font-bold text-primary mb-2 flex items-center gap-2 px-4">
                  <User className="w-4 h-4" /> {user?.name}
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-text-muted hover:text-text-main py-3 px-4 rounded-md hover:bg-bg-main text-sm font-semibold"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-text-muted hover:text-text-main py-3 px-4 rounded-md hover:bg-bg-main text-sm font-semibold"
                >
                  <History className="w-4 h-4" /> My Bookings
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-text-muted hover:text-text-main py-3 px-4 rounded-md hover:bg-bg-main text-sm font-semibold"
                >
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-400 py-3 px-4 rounded-md hover:bg-bg-main text-sm text-left w-full cursor-pointer font-semibold"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-border-glass px-4 pb-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-glass w-full text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  Book a Vehicle
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
