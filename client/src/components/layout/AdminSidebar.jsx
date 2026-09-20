import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Car, Users, BarChart3, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const { user } = useAuth();

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Manage Vehicles', path: '/admin/vehicles', icon: Car },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Reports & Stats', path: '/admin/reports', icon: BarChart3 }
  ];

  return (
    <div className="w-full md:w-64 bg-bg-secondary/40 border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between shrink-0 h-auto md:h-screen md:sticky md:top-0">
      
      {/* Top Sidebar Content */}
      <div className="flex flex-col gap-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary justify-center md:justify-start select-none">
          <Car className="w-6 h-6 stroke-[2.5]" />
          <span>VeloRent Admin</span>
        </Link>

        {/* User Card Summary */}
        <div className="hidden md:flex gap-3 items-center bg-white/5 border border-white/5 p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            AD
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-white text-xs truncate">{user?.name}</h4>
            <span className="text-[9px] uppercase tracking-widest text-primary font-bold">Administrator</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-primary text-black shadow-lg shadow-primary/20 hover:scale-102'
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Sidebar Links */}
      <div className="hidden md:flex flex-col gap-2 pt-6 border-t border-white/5">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-white hover:bg-white/5 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Renter View</span>
        </Link>
      </div>

    </div>
  );
}
