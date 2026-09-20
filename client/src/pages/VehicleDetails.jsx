import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, Fuel, Settings, Users, Calendar, ShieldCheck, MapPin, Award, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [daysCount, setDaysCount] = useState(0);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await api.get(`/vehicles/${id}`);
        if (response.data && response.data.success) {
          setVehicle(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load vehicle details:', error);
        toast.error('Vehicle details not found');
        navigate('/vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id, navigate]);

  useEffect(() => {
    if (startDate && endDate && vehicle) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end > start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysCount(diffDays);
        setTotalPrice(diffDays * vehicle.price_per_day);
      } else {
        setDaysCount(0);
        setTotalPrice(0);
      }
    } else {
      setDaysCount(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, vehicle]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to rent this vehicle');
      navigate(`/login?redirect=/vehicles/${id}`);
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select both pickup and return dates');
      return;
    }

    if (daysCount <= 0) {
      toast.error('Invalid date range. Return date must be after pickup date');
      return;
    }

    // Direct booking flow
    navigate(`/booking/${id}?start_date=${startDate}&end_date=${endDate}`);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 w-full flex items-center justify-center min-h-[70vh]">
        <div className="text-primary font-bold animate-pulse text-lg">Loading luxury vehicle details...</div>
      </div>
    );
  }

  if (!vehicle) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto w-full min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Image & Specifications */}
        <div className="lg:col-span-7 flex flex-col gap-8 animate-fade-in">
          
          {/* Main Vehicle Image */}
          <div className="w-full aspect-[16/10] rounded-3xl overflow-hidden glass-panel p-2 shadow-2xl relative">
            <img
              src={vehicle.image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover rounded-2xl"
            />
            {!vehicle.is_available && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-red-400 font-extrabold text-2xl tracking-widest backdrop-blur-sm rounded-2xl">
                OUT OF SERVICE / RESERVED
              </div>
            )}
          </div>

          {/* Core Specs Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-2xl text-center flex flex-col items-center gap-2">
              <Fuel className="w-5 h-5 text-primary" />
              <span className="text-xs text-text-muted">Fuel Type</span>
              <span className="font-bold text-white capitalize text-sm">{vehicle.fuel_type}</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center flex flex-col items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <span className="text-xs text-text-muted">Transmission</span>
              <span className="font-bold text-white capitalize text-sm">{vehicle.transmission}</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center flex flex-col items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-xs text-text-muted">Seats</span>
              <span className="font-bold text-white text-sm">{vehicle.seats} Passengers</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center flex flex-col items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-xs text-text-muted">Rating</span>
              <span className="font-bold text-white text-sm">{Number(vehicle.rating).toFixed(1)} ★</span>
            </div>
          </div>

          {/* Description Block */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white">Vehicle Description</h2>
            <p className="text-text-muted leading-relaxed text-sm md:text-base">
              {vehicle.description || 'Experience premium performance and uncompromised comfort. This vehicle has been thoroughly inspected, detailed, and validated for a high-quality rental experience.'}
            </p>
          </div>

          {/* Safety Features Block */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">VeloRent Safety Promise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Deep Cleaned & Sanitized</h4>
                  <p className="text-text-muted text-xs mt-0.5">Sanitized touchpoints prior to every key exchange.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">24/7 Roadside Assistance</h4>
                  <p className="text-text-muted text-xs mt-0.5">Real-time emergency breakdowns and towing support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Booking Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-3xl flex flex-col gap-6 lg:sticky lg:top-24 shadow-2xl">
            
            {/* Header info */}
            <div>
              <span className="text-xs font-bold text-primary tracking-widest uppercase">{vehicle.brand}</span>
              <h1 className="text-3xl font-extrabold text-white mt-1">
                {vehicle.brand} {vehicle.model}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                  <Star className="w-4 h-4 fill-yellow-400 stroke-none" />
                  <span>{Number(vehicle.rating).toFixed(1)}</span>
                  <span className="text-text-muted font-normal">({vehicle.total_ratings || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-text-muted text-xs">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{vehicle.location || 'Mumbai'}</span>
                </div>
              </div>
            </div>

            {/* Price section */}
            <div className="py-4 border-y border-white/5 flex justify-between items-center">
              <div>
                <span className="text-xs text-text-muted">Rental Daily Price</span>
                <div className="text-2xl font-extrabold text-white">
                  ₹{Number(vehicle.price_per_day).toLocaleString('en-IN')}{' '}
                  <span className="text-sm text-text-muted font-normal">/ day</span>
                </div>
              </div>
              <div className="flex gap-1 items-center bg-primary/10 border border-primary/20 text-primary font-bold text-xs px-3 py-1.5 rounded-lg">
                <Award className="w-4 h-4" />
                <span>Best Price Guaranteed</span>
              </div>
            </div>

            {/* Date selection form */}
            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Pickup Date</span>
                </label>
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-bg-secondary border-white/10 text-white rounded-xl text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Return Date</span>
                </label>
                <input
                  type="date"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-bg-secondary border-white/10 text-white rounded-xl text-sm"
                  required
                />
              </div>

              {/* Price Calculation breakdown */}
              {daysCount > 0 && (
                <div className="bg-bg-secondary/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 text-sm">
                  <div className="flex justify-between items-center text-text-muted text-xs">
                    <span>Daily Rate</span>
                    <span className="font-mono">₹{Number(vehicle.price_per_day).toLocaleString('en-IN')} × {daysCount} Days</span>
                  </div>
                  <div className="flex justify-between items-center text-text-muted text-xs">
                    <span>GST (18%)</span>
                    <span className="font-mono">₹{(totalPrice * 0.18).toLocaleString('en-IN')}</span>
                  </div>
                  <hr className="border-white/5" />
                  <div className="flex justify-between items-center text-white font-bold">
                    <span>Total Price</span>
                    <span className="text-primary font-mono text-lg">₹{(totalPrice * 1.18).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!vehicle.is_available}
                className="w-full btn btn-primary py-3 rounded-xl font-bold mt-2 flex items-center justify-center gap-2"
              >
                <span>Rent This Vehicle</span>
                <ShieldCheck className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
