import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import VehicleCard from '../components/shared/VehicleCard';
import { ArrowRight, Search, ShieldCheck, Zap, CreditCard, Clock, Star } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[95vh] flex items-center justify-center pt-24 px-6 md:px-12">
        {/* Glow Effects */}
        <div className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-primary/20 blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-accent/25 blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full z-10">
          {/* Hero Left Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <span className="text-xs uppercase tracking-widest text-primary font-bold bg-primary/10 border border-primary/20 px-4 py-2 rounded-full w-fit mx-auto lg:mx-0">
              Introducing Premium Car & Bike Rental
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Elevate Your <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Journey
              </span>
            </h1>
            <p className="text-text-muted text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Experience the ultimate freedom of premium vehicles. Explore handpicked sports cars, luxury sedans, off-road SUVs, and superbikes. No paperwork, fully digital reservation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Link to="/vehicles" className="btn btn-primary px-8 py-3.5 rounded-full flex items-center gap-2 font-bold w-full sm:w-auto text-center justify-center">
                Explore Fleet
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="btn btn-glass px-8 py-3.5 rounded-full font-bold w-full sm:w-auto text-center justify-center">
                How It Works
              </a>
            </div>
          </div>

          {/* Hero Right Image */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-xl aspect-[16/10] rounded-3xl overflow-hidden glass-panel p-2 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop"
                alt="Porsche 911 Hero"
                className="w-full h-full object-cover rounded-2xl shadow-xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/10 bg-bg-secondary/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-primary">50+</h3>
            <p className="text-text-muted text-xs md:text-sm mt-1 uppercase tracking-wider">Premium Models</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">10k+</h3>
            <p className="text-text-muted text-xs md:text-sm mt-1 uppercase tracking-wider">Happy Renters</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">15+</h3>
            <p className="text-text-muted text-xs md:text-sm mt-1 uppercase tracking-wider">Indian Cities</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-primary">4.9★</h3>
            <p className="text-text-muted text-xs md:text-sm mt-1 uppercase tracking-wider">App Rating</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto text-center flex flex-col gap-4 mb-16">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">Simple Process</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white">How VeloRent Works</h2>
          <p className="text-text-muted max-w-xl mx-auto text-sm md:text-base">
            Renting a premium vehicle has never been this easy. Get behind the wheel in just four simple steps.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center gap-4 relative">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">1. Select Vehicle</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Browse our premium collection of cars and bikes and choose the one that fits your style.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center gap-4 relative">
            <div className="p-4 bg-accent/10 rounded-2xl text-accent border border-accent/20">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">2. Pick Dates</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Select your rental start and end dates. Real-time availability check prevents overlapping bookings.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center gap-4 relative">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">3. Pay Securely</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Complete your reservation with secure payment options like UPI, Cards, or Net Banking.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center gap-4 relative">
            <div className="p-4 bg-accent/10 rounded-2xl text-accent border border-accent/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">4. Take Delivery</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Grab the keys from your selected location or get it delivered to your doorstep. Happy renting!
            </p>
          </div>
        </div>
      </section>

      {/* Featured Fleet Section */}
      <section className="py-24 px-6 bg-bg-secondary/40 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-primary font-bold">Curated Collection</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Featured Fleet</h2>
          </div>
          <Link to="/vehicles" className="btn btn-glass px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 self-center md:self-auto">
            View All Vehicles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-panel rounded-3xl overflow-hidden h-96 animate-pulse p-6 flex flex-col justify-between">
                  <div className="bg-white/5 h-48 w-full rounded-2xl mb-4"></div>
                  <div className="bg-white/5 h-6 w-2/3 rounded-md mb-2"></div>
                  <div className="bg-white/5 h-4 w-1/2 rounded-md mb-6"></div>
                  <div className="bg-white/5 h-10 w-full rounded-full"></div>
                </div>
              ))}
            </div>
          ) : featuredVehicles.length === 0 ? (
            <div className="text-center text-text-muted py-12">
              No vehicles available in the database. Run backend seeds to populate.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <span className="text-xs uppercase tracking-widest text-primary font-bold">Why Choose Us</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Ride In Luxury. Worry Less.</h2>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              We focus on safety, security, and transparent rentals. Get fully maintained premium assets with zero hidden charges.
            </p>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20 mt-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Comprehensive Insurance</h4>
                  <p className="text-text-muted text-xs md:text-sm mt-0.5">Every ride comes with secondary damage waivers and primary liability shields.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-accent/10 rounded-xl text-accent border border-accent/20 mt-1">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Instant Approvals</h4>
                  <p className="text-text-muted text-xs md:text-sm mt-0.5">Upload your license, complete facial mapping, and get approved within 15 minutes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="glass-panel p-4 rounded-3xl aspect-square w-full max-w-md mx-auto relative shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"
                alt="BMW Luxury interior"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-bg-secondary/20">
        <div className="max-w-7xl mx-auto text-center flex flex-col gap-4 mb-16">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">Reviews</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white">What Customers Say</h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl flex flex-col gap-4 text-left">
            <div className="flex text-yellow-400 gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-yellow-400 stroke-none" />
              ))}
            </div>
            <p className="text-text-muted text-sm leading-relaxed italic">
              "Rented a Duke 390 for a weekend getaway. The pickup process was completely digital and key handover took under 2 minutes. The bike was pristine!"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                RS
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Rahul Sharma</h4>
                <p className="text-text-muted text-xs">Customer since 2024</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl flex flex-col gap-4 text-left">
            <div className="flex text-yellow-400 gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-yellow-400 stroke-none" />
              ))}
            </div>
            <p className="text-text-muted text-sm leading-relaxed italic">
              "Outstanding service. The S-Class was in showroom condition. Perfect for my business conference in Mumbai. Highly recommend VeloRent!"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                AK
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Arjun Kumar</h4>
                <p className="text-text-muted text-xs">Premium Renter</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl flex flex-col gap-4 text-left">
            <div className="flex text-yellow-400 gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-yellow-400 stroke-none" />
              ))}
            </div>
            <p className="text-text-muted text-sm leading-relaxed italic">
              "The Thar was incredibly fun to drive. The mock payments worked smoothly and the customer support was extremely responsive to extension requests."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                PP
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Priya Patel</h4>
                <p className="text-text-muted text-xs">Verified Commuter</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
