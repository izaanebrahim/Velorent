import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import VehicleCard from '../components/shared/VehicleCard';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

const CATEGORIES = ['All', 'Sports', 'Luxury', 'SUV', 'Sedan', 'Bike', 'Scooter'];

export default function Vehicles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState(25000); // Max default price filter limit

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (search) params.append('search', search);
      if (transmission) params.append('transmission', transmission);
      if (fuelType) params.append('fuel_type', fuelType);
      if (sort) params.append('sort', sort);
      if (priceRange) params.append('max_price', priceRange);
      
      const response = await api.get(`/vehicles?${params.toString()}`);
      if (response.data && response.data.success) {
        setVehicles(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search, transmission, fuelType, sort, priceRange]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchVehicles();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchVehicles]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setTransmission('');
    setFuelType('');
    setSort('newest');
    setPriceRange(25000);
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto w-full min-h-screen">
      {/* Page Title */}
      <div className="flex flex-col gap-2 mb-12 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">Browse Premium Fleet</h1>
        <p className="text-text-muted">Select and secure your choice of premium cars or high-octane bikes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="glass-panel p-6 rounded-3xl h-fit flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span>Filters</span>
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search bar inside filters */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Search Model</label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Porsche, Fortuner..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-bg-secondary/40 border-white/10 text-white placeholder-white/30 rounded-xl"
              />
              <Search className="absolute left-3 w-4 h-4 text-text-muted" />
            </div>
          </div>

          {/* Max Price Range */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-text-muted">
              <span>Max Daily Price</span>
              <span className="text-primary font-mono">₹{priceRange.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="300"
              max="25000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="accent-primary w-full h-1 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Transmission Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Transmission</label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-bg-secondary/40 border-white/10 text-white rounded-xl"
            >
              <option value="">All Transmissions</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>

          {/* Fuel Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Fuel Type</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-bg-secondary/40 border-white/10 text-white rounded-xl"
            >
              <option value="">All Fuel Types</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-bg-secondary/40 border-white/10 text-white rounded-xl"
            >
              <option value="newest">Newest Fleet</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Vehicles Display */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Category Chips Bar */}
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-2 px-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-5 py-2 rounded-full font-semibold text-xs border whitespace-nowrap cursor-pointer transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-primary text-black border-primary shadow-lg shadow-primary/25 hover:scale-105'
                    : 'bg-white/5 border-white/10 text-text-muted hover:border-white/25'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="glass-panel rounded-3xl overflow-hidden h-96 p-4 animate-pulse flex flex-col justify-between">
                  <div className="bg-white/5 h-44 w-full rounded-2xl mb-4"></div>
                  <div className="bg-white/5 h-5 w-2/3 rounded mb-2"></div>
                  <div className="bg-white/5 h-4 w-1/2 rounded mb-6"></div>
                  <div className="bg-white/5 h-10 w-full rounded-full"></div>
                </div>
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="glass-panel p-16 rounded-3xl text-center text-text-muted flex flex-col items-center gap-4">
              <Filter className="w-12 h-12 text-primary/50" />
              <div className="text-lg font-bold text-white">No Vehicles Match Your Search</div>
              <p className="text-sm max-w-xs leading-relaxed">
                Try loosening your filters, selecting a different category, or searching something else.
              </p>
              <button onClick={resetFilters} className="btn btn-primary px-6 py-2.5 rounded-full text-xs font-bold mt-2">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
