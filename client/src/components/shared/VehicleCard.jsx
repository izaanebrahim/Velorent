import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Fuel, Settings, Users, ArrowRight } from 'lucide-react';

export default function VehicleCard({ vehicle }) {
  const {
    id,
    brand,
    model,
    category,
    price_per_day,
    fuel_type,
    transmission,
    seats,
    rating,
    image_url,
    is_available
  } = vehicle;

  return (
    <div className="glass-panel group rounded-3xl overflow-hidden flex flex-col h-full hover:-translate-y-2 transition-all duration-300">
      {/* Vehicle Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-bg-secondary">
        <img
          src={image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'}
          alt={`${brand} ${model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'; // fallback SUV
          }}
        />
        {/* Availability Badge */}
        <span
          className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border ${
            is_available
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}
        >
          {is_available ? 'Available' : 'Booked'}
        </span>
        {/* Category Tag */}
        <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10">
          {category}
        </span>
      </div>

      {/* Info Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Brand & Rating */}
        <div className="flex justify-between items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">{brand}</span>
          <div className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
            <Star className="w-4 h-4 fill-yellow-400 stroke-none" />
            <span>{Number(rating).toFixed(1)}</span>
          </div>
        </div>

        {/* Model Title */}
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-1">
          {brand} {model}
        </h3>

        {/* Vehicle Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-4 mb-6 border-y border-white/5 text-xs text-text-muted">
          <div className="flex flex-col items-center gap-1">
            <Fuel className="w-4 h-4 text-primary" />
            <span className="capitalize">{fuel_type}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Settings className="w-4 h-4 text-primary" />
            <span className="capitalize">{transmission}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users className="w-4 h-4 text-primary" />
            <span>{seats} Seats</span>
          </div>
        </div>

        {/* Pricing and Action Button */}
        <div className="flex justify-between items-center mt-auto">
          <div>
            <span className="text-xs text-text-muted block">Daily Rate</span>
            <div className="text-xl font-bold text-white">
              ₹{Number(price_per_day).toLocaleString('en-IN')}{' '}
              <span className="text-xs text-text-muted font-normal">/ day</span>
            </div>
          </div>
          <Link
            to={`/vehicles/${id}`}
            className="flex items-center justify-center p-3.5 rounded-full bg-white/5 hover:bg-primary hover:text-black text-white hover:scale-105 transition-all duration-300"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
