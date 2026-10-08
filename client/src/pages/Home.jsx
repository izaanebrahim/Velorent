import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import VehicleCard from '../components/shared/VehicleCard';
import { Search, MapPin, Calendar, Clock, ArrowRight, ShieldCheck, Zap, Settings, BarChart3, Users, LayoutDashboard, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/vehicles?limit=3');
        if (response.data && response.data.success) {
          setFeaturedVehicles(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch featured vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 lg:px-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="flex flex-col gap-6 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full w-fit mx-auto lg:mx-0 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            VeloRent Management Platform
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-text-main">
            Vehicle rental, <br />
            <span className="text-text-muted">managed simply.</span>
          </h1>
          <p className="text-text-muted text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed mt-2">
            The complete platform for vehicle rental businesses. Manage your fleet, process bookings, track revenue, and serve customers—all from one intuitive dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-4">
            <Link to="/vehicles" className="btn-primary w-full sm:w-auto text-center">
              Explore Vehicles
            </Link>
            <a href="#how-it-works" className="btn-glass w-full sm:w-auto text-center">
              How It Works
            </a>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start gap-8 mt-8 pt-8 border-t border-border-glass/50 text-sm text-text-muted">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-text-main text-2xl">500+</span>
              <span>Active Vehicles</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-text-main text-2xl">10k+</span>
              <span>Completed Rentals</span>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden glass-panel">
          <img 
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&auto=format&fit=crop" 
            alt="Premium Vehicle Rental" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent opacity-80"></div>
          
          {/* Floating UI Element to show "Software" aspect */}
          <div className="absolute bottom-6 left-6 right-6 glass-panel-heavy p-4 rounded-xl flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-main">Booking Confirmed</p>
                <p className="text-xs text-text-muted">Toyota Fortuner • 3 Days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-text-main">₹19,500</p>
              <p className="text-xs text-emerald-500 font-medium">Paid in full</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Search Bar Section (Functional & Grounded) */}
      <section className="py-8 px-6 bg-bg-secondary border-y border-border-glass">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="w-full flex-1 flex flex-col md:flex-row gap-4 glass-panel p-2 rounded-xl">
            <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-border-glass">
              <MapPin className="w-5 h-5 text-text-muted shrink-0" />
              <div className="flex flex-col w-full">
                <label className="text-[10px] uppercase font-bold text-text-muted">Pick-up Location</label>
                <select className="bg-transparent border-none p-0 text-sm font-semibold text-text-main focus:ring-0 w-full cursor-pointer">
                  <option value="mumbai">Mumbai Airport (BOM)</option>
                  <option value="delhi">Delhi Airport (DEL)</option>
                  <option value="bangalore">Bangalore Central</option>
                </select>
              </div>
            </div>
            
            <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-border-glass">
              <Calendar className="w-5 h-5 text-text-muted shrink-0" />
              <div className="flex flex-col w-full">
                <label className="text-[10px] uppercase font-bold text-text-muted">Pick-up Date</label>
                <input type="date" className="bg-transparent border-none p-0 text-sm font-semibold text-text-main focus:ring-0 w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert opacity-80" />
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3 px-4 py-2">
              <Clock className="w-5 h-5 text-text-muted shrink-0" />
              <div className="flex flex-col w-full">
                <label className="text-[10px] uppercase font-bold text-text-muted">Return Date</label>
                <input type="date" className="bg-transparent border-none p-0 text-sm font-semibold text-text-main focus:ring-0 w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert opacity-80" />
              </div>
            </div>
          </div>
          
          <Link to="/vehicles" className="btn-primary py-4 px-8 w-full md:w-auto flex items-center justify-center gap-2 whitespace-nowrap">
            <Search className="w-4 h-4" />
            Find Vehicles
          </Link>
        </div>
      </section>

      {/* Featured Fleet Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-text-main">Premium Fleet</h2>
            <p className="text-text-muted text-sm md:text-base max-w-2xl">
              Our diverse collection of meticulously maintained vehicles, from compact sedans to luxury SUVs and superbikes.
            </p>
          </div>
          <Link to="/vehicles" className="btn-glass text-sm flex items-center gap-2 shrink-0">
            View Inventory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-panel h-[400px] animate-pulse"></div>
            ))}
          </div>
        ) : featuredVehicles.length === 0 ? (
          <div className="text-center text-text-muted py-12 glass-panel">
            No vehicles currently available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section - Software Focused */}
      <section className="py-24 px-6 bg-bg-secondary border-y border-border-glass">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-text-main mb-4">Everything you need to run your rental business.</h2>
            <p className="text-text-muted text-lg">
              VeloRent isn't just a booking site. It's a comprehensive operations platform built specifically for modern vehicle rental agencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">Vehicle Management</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Manage your entire fleet from one place. Track maintenance schedules, availability status, and location tracking in real-time.
              </p>
            </div>
            
            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">Booking Operations</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Process reservations seamlessly. Prevent double-bookings with our centralized calendar and automated availability checks.
              </p>
            </div>

            <div className="glass-panel p-8">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">Customer Profiles</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Maintain detailed customer records, KYC documents, rental history, and billing profiles in a secure, compliant system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Management Dashboard Showcase */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-text-main">
              Run your rental business from one place.
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-4">
              Stop juggling spreadsheets and disconnected tools. VeloRent brings your fleet, finances, and customers into a single, powerful command center.
            </p>
            <ul className="flex flex-col gap-4 text-text-main font-medium">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                Real-time fleet utilization tracking
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                Automated invoicing and payment collection
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                Comprehensive revenue reporting
              </li>
            </ul>
          </div>

          {/* Realistic Dashboard Mockup */}
          <div className="relative w-full h-[450px] glass-panel-heavy rounded-2xl p-6 flex flex-col shadow-2xl border border-border-glass">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-glass">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-text-muted" />
                <span className="font-semibold text-sm">Dashboard Overview</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Last 30 Days</span>
                <Clock className="w-4 h-4 text-text-muted" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-bg-main border border-border-glass rounded-lg p-4">
                <span className="text-xs text-text-muted uppercase font-bold tracking-wider mb-2 block">Monthly Revenue</span>
                <span className="text-2xl font-bold text-text-main">₹8,45,000</span>
                <span className="text-xs text-emerald-500 font-medium ml-2">+12.5%</span>
              </div>
              <div className="bg-bg-main border border-border-glass rounded-lg p-4">
                <span className="text-xs text-text-muted uppercase font-bold tracking-wider mb-2 block">Active Rentals</span>
                <span className="text-2xl font-bold text-text-main">42</span>
                <span className="text-xs text-text-muted font-medium ml-2">/ 65 total</span>
              </div>
            </div>

            <div className="flex-1 bg-bg-main border border-border-glass rounded-lg p-4 flex flex-col">
               <span className="text-xs text-text-muted uppercase font-bold tracking-wider mb-4 block">Recent Bookings</span>
               <div className="flex flex-col gap-3">
                 {[
                   { name: 'Rahul Sharma', car: 'Mahindra Thar', status: 'Active', amount: '₹13,500' },
                   { name: 'Priya Patel', car: 'Honda City', status: 'Upcoming', amount: '₹7,500' },
                   { name: 'Arjun Kumar', car: 'KTM Duke 390', status: 'Completed', amount: '₹2,400' }
                 ].map((b, i) => (
                   <div key={i} className="flex justify-between items-center text-sm border-b border-border-glass/50 pb-2 last:border-0">
                     <div>
                       <p className="font-semibold text-text-main">{b.name}</p>
                       <p className="text-xs text-text-muted">{b.car}</p>
                     </div>
                     <div className="text-right">
                       <p className="font-semibold text-text-main">{b.amount}</p>
                       <p className={`text-xs ${b.status === 'Active' ? 'text-emerald-500' : b.status === 'Completed' ? 'text-text-muted' : 'text-accent'}`}>{b.status}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Simplified */}
      <section id="how-it-works" className="py-24 px-6 bg-bg-secondary border-t border-border-glass">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-3xl font-bold text-text-main mb-16">Simple, transparent booking process.</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <span className="text-4xl font-black text-border-glass mb-4">01</span>
              <h3 className="text-lg font-bold text-text-main mb-2">Choose your vehicle</h3>
              <p className="text-sm text-text-muted">Select from our extensive fleet of well-maintained cars and bikes.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-4xl font-black text-border-glass mb-4">02</span>
              <h3 className="text-lg font-bold text-text-main mb-2">Select rental dates</h3>
              <p className="text-sm text-text-muted">Choose your pick-up and return schedule with real-time availability.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-4xl font-black text-border-glass mb-4">03</span>
              <h3 className="text-lg font-bold text-text-main mb-2">Confirm booking</h3>
              <p className="text-sm text-text-muted">Complete KYC and pay securely online with transparent pricing.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-4xl font-black text-border-glass mb-4">04</span>
              <h3 className="text-lg font-bold text-text-main mb-2">Pick up and drive</h3>
              <p className="text-sm text-text-muted">Collect your vehicle from our hub or get it delivered to your door.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
