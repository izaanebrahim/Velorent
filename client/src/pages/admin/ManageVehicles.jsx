import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, CheckCircle, Search, X, Car } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('sedan');
  const [category, setCategory] = useState('Sedan');
  const [pricePerDay, setPricePerDay] = useState('');
  const [fuelType, setFuelType] = useState('petrol');
  const [transmission, setTransmission] = useState('manual');
  const [seats, setSeats] = useState(4);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Mumbai');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vehicles?available=false&include_unapproved=true'); // retrieve booked & unapproved too
      if (response.data && response.data.success) {
        setVehicles(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin fleet:', error);
      toast.error('Failed to load fleet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleApproveVehicle = async (id) => {
    try {
      const response = await api.put(`/vehicles/${id}`, { is_approved: true });
      if (response.data && response.data.success) {
        toast.success('Vehicle listing approved successfully!');
        fetchVehicles();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Approval failed.');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle listing? This action is permanent.')) {
      return;
    }

    try {
      const response = await api.delete(`/vehicles/${id}`);
      if (response.data && response.data.success) {
        toast.success('Vehicle deleted successfully.');
        fetchVehicles();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete operation failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      const payload = {
        brand,
        model,
        type,
        category,
        price_per_day: Number(pricePerDay),
        fuel_type: fuelType,
        transmission,
        seats: Number(seats),
        image_url: imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
        description,
        location
      };

      const response = await api.post('/vehicles', payload);
      if (response.data && response.data.success) {
        toast.success('New vehicle listed in the fleet successfully!');
        setIsModalOpen(false);
        fetchVehicles();
        // Reset form
        setBrand(''); setModel(''); setPricePerDay(''); setImageUrl(''); setDescription('');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Creation failed.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v =>
    `${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 animate-fade-in w-full">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Manage Vehicles</h1>
          <p className="text-text-muted text-xs">Add new listings, approve hosts, and prune inventory.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer font-bold"
        >
          <Plus className="w-4 h-4 text-black stroke-[3]" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Search & filters */}
      <div className="flex max-w-md relative items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fleet by brand, model, category..."
          className="w-full pl-10 pr-4 py-2 text-xs bg-bg-secondary/40 border-white/10 text-white placeholder-white/20 rounded-xl"
        />
        <Search className="absolute left-3 w-4 h-4 text-text-muted" />
      </div>

      {/* Fleet data list */}
      {loading ? (
        <div className="text-center py-12 text-primary font-bold animate-pulse text-sm">
          Loading fleet inventory...
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl text-center text-text-muted flex flex-col items-center gap-2">
          <Car className="w-12 h-12 text-primary/50" />
          <div className="text-lg font-bold text-white">No vehicles found</div>
          <p className="text-xs">Create a new vehicle listing to populate the system database.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-text-muted uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Vehicle Model</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Specs</th>
                  <th className="py-3 px-4 text-right">Daily Rate</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-bg-secondary border border-white/5">
                        <img src={v.image_url} alt={v.model} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      <div className="text-white font-bold">{v.brand} {v.model}</div>
                      <span className="text-[10px] text-text-muted font-mono capitalize">{v.location || 'Mumbai'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                        {v.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono capitalize text-text-muted">
                      {v.transmission} • {v.fuel_type} • {v.seats} seats
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-white font-bold">
                      ₹{Number(v.price_per_day).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.is_available
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {v.is_available ? 'Available' : 'Booked'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex gap-2 justify-center items-center">
                        {!v.is_approved && (
                          <button
                            onClick={() => handleApproveVehicle(v.id)}
                            title="Approve Host Listing"
                            className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg cursor-pointer transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteVehicle(v.id)}
                          title="Delete Vehicle"
                          className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg cursor-pointer transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
          <div className="glass-panel-heavy max-w-2xl w-full p-8 rounded-3xl flex flex-col gap-6 shadow-2xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 text-text-muted hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                <span>List a New Premium Vehicle</span>
              </h2>
              <p className="text-text-muted text-xs mt-1">Configure specifications, daily rental pricing, and image URLs.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Brand / Maker</label>
                  <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Porsche, Royal Enfield" className="w-full px-4 py-2 bg-bg-secondary/40 border-white/10 text-white rounded-xl text-xs" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Model Name</label>
                  <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. 911 Carrera, Classic 350" className="w-full px-4 py-2 bg-bg-secondary/40 border-white/10 text-white rounded-xl text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Body Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 bg-bg-secondary/40 border-white/10 text-white rounded-xl text-xs">
                    <option value="sedan">Sedan</option>
                    <option value="luxury">Luxury</option>
                    <option value="suv">SUV</option>
                    <option value="sports">Sports</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Category Class</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 bg-bg-secondary/40 border-white/10 text-white rounded-xl text-xs">
                    <option value="Sedan">Sedan</option>
                    <option value="Luxury">Luxury</option>
                    <option value="SUV">SUV</option>
                    <option value="Sports">Sports</option>
                    <option value="Bike">Bike</option>
                    <option value="Scooter">Scooter</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Daily Rate (₹ INR)</label>
                  <input type="number" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} placeholder="e.g. 15000, 800" className="w-full px-4 py-2 bg-bg-secondary/40 border-white/10 text-white rounded-xl text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Transmission</label>
                  <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="w-full px-4 py-2 bg-bg-secondary/40 border-white/10 text-white rounded-xl text-xs">
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Fuel Type</label>
                  <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="w-full px-4 py-2 bg-bg-secondary/40 border-white/10 text-white rounded-xl text-xs">
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Seat Count / Capacity</label>
                  <input type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} className="w-full px-4 py-2 bg-bg-secondary/40 border-white/10 text-white rounded-xl text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">City / Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Mumbai, Bangalore" className="w-full px-4 py-2 bg-bg-secondary/40 border-white/10 text-white rounded-xl text-xs" required />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Image URL</label>
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Unsplash URL recommended" className="w-full px-4 py-2 bg-bg-secondary/40 border-white/10 text-white rounded-xl text-xs" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Detailed Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize engine displacement, trim, special packages, or driver recommendations..."
                  rows="3"
                  className="w-full px-4 py-2 bg-bg-secondary/40 border-white/10 text-white rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full btn btn-primary py-2.5 rounded-xl font-bold mt-4 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{submitLoading ? 'Listing Vehicle...' : 'Submit Vehicle Listing'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
