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
    <nav className="glass-panel fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl px-6 py-3 z-50 flex justify-between items-center rounded-full transition-all duration-300">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary select-none">
        <Car className="w-6 h-6 stroke-[2.5]" />
        <span>VeloRent</span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8 font-medium">
        <Link
          to="/vehicles"
          className={`hover:text-primary transition-colors text-sm ${
            isActive('/vehicles') ? 'text-primary' : 'text-text-muted'
          }`}
        >
          Explore Fleet
        </Link>
        <a
          href="#how-it-works"
          className="text-text-muted hover:text-primary transition-colors text-sm"
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
      </div>

      {/* Actions */}
      <div className="hidden md:flex items-center gap-4">
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 btn-glass px-4 py-2 rounded-full text-sm cursor-pointer select-none"
            >
              <User className="w-4 h-4 text-primary" />
              <span>{user?.name}</span>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel-heavy p-2 shadow-2xl z-50 border border-white/10 flex flex-col gap-1">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-primary hover:bg-white/5 rounded-lg transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-primary hover:bg-white/5 rounded-lg transition-all"
                  >
                    <History className="w-4 h-4" />
                    My Bookings
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-primary hover:bg-white/5 rounded-lg transition-all"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <hr className="border-white/10 my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg w-full text-left cursor-pointer transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-glass px-5 py-2 text-sm rounded-full">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary px-5 py-2 text-sm rounded-full">
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Trigger */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-white hover:text-primary transition-colors cursor-pointer"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 glass-panel-heavy mx-4 p-6 rounded-2xl flex flex-col gap-4 border border-white/10 shadow-2xl z-50 md:hidden animate-fade-in">
          <Link
            to="/vehicles"
            onClick={() => setMobileMenuOpen(false)}
            className="text-text-muted hover:text-primary font-medium transition-colors py-2 border-b border-white/5"
          >
            Explore Fleet
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
            className="text-text-muted hover:text-primary font-medium transition-colors py-2 border-b border-white/5"
          >
            How It Works
          </a>

          {isAuthenticated ? (
            <div className="flex flex-col gap-2 pt-2">
              <div className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> {user?.name}
              </div>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-text-muted hover:text-primary py-2 text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                </Link>
              )}
              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-text-muted hover:text-primary py-2 text-sm"
              >
                <History className="w-4 h-4" /> My Bookings
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-text-muted hover:text-primary py-2 text-sm"
              >
                <User className="w-4 h-4" /> My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 py-2 text-sm text-left w-full cursor-pointer mt-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-glass w-full text-center py-2.5 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary w-full text-center py-2.5 rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
