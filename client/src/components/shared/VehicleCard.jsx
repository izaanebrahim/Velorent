import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fuel, Settings, Users } from 'lucide-react';

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
    image_url,
    is_available
  } = vehicle;

  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/vehicles/${id}`)}
      className="bg-bg-secondary border border-border-glass rounded-xl overflow-hidden flex flex-col h-full hover:border-border-glass/80 transition-colors group cursor-pointer"
    >
      {/* Vehicle Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-bg-main border-b border-border-glass">
        <img
          src={image_url || '/images/vehicles/porsche_911.jpg'}
          alt={`${brand} ${model}`}
          className="w-full h-full object-contain object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = '/images/vehicles/mahindra_thar.jpg'; // fallback SUV
          }}
        />
        {/* Availability Badge */}
        <span
          className={`absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm ${
            is_available
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {is_available ? 'Available' : 'Booked'}
        </span>
      </div>

      {/* Info Content */}
      <div className="p-5 flex flex-col flex-grow">
        
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{category}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-text-main mb-4 leading-tight">
          {brand} {model}
        </h3>

        {/* Vehicle Specs Text instead of Grid Icons (Cleaner) */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-sm text-text-muted">
          <span className="capitalize">{transmission}</span>
          <span className="text-border-glass">•</span>
          <span className="capitalize">{fuel_type}</span>
          <span className="text-border-glass">•</span>
          <span>{seats} Seats</span>
        </div>

        {/* Pricing and Action Button */}
        <div className="flex justify-between items-end mt-auto pt-4 border-t border-border-glass">
          <div>
            <div className="text-lg font-bold text-text-main">
              ₹{Number(price_per_day).toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-text-muted">per day</span>
          </div>
          <Link
            to={`/vehicles/${id}`}
            onClick={(e) => e.stopPropagation()}
            className="btn-primary text-sm px-4 py-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
