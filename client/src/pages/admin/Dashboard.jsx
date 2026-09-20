import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Users, Car, Calendar, IndianRupee, History, RefreshCw, Landmark } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stats');
      if (response.data && response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to get dashboard statistics:', error);
      toast.error('Failed to retrieve server statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full text-primary font-bold animate-pulse text-sm">
        Retrieving administrative telemetry...
      </div>
    );
  }

  if (!stats) return null;

  const { overview, recentBookings, vehicleStats, monthlyRevenue } = stats;

  // Pie chart data formatting
  const pieData = [
    { name: 'Available', value: Number(vehicleStats.available || 0) },
    { name: 'Rented', value: Number(vehicleStats.rented || 0) }
  ];
  const COLORS = ['#00dc82', '#3b82f6'];

  // Format revenue area chart data (reverse to chronological order)
  const revenueChartData = [...(monthlyRevenue || [])].reverse().map(item => ({
    name: new Date(item.month + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
    Revenue: Number(item.revenue)
  }));

  return (
    <div className="flex flex-col gap-8 animate-fade-in w-full">
      {/* Dashboard title header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Administrative Overview</h1>
          <p className="text-text-muted text-xs">Analyze revenue velocities, fleets, and renter booking behaviors.</p>
        </div>
        <button
          onClick={fetchStats}
          className="btn btn-glass px-4 py-2 text-xs rounded-xl flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex flex-col">
            <span className="text-text-muted text-xs font-bold uppercase tracking-wider">Total Users</span>
            <span className="text-2xl font-bold text-white mt-2">{overview.totalUsers}</span>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Fleet Size */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex flex-col">
            <span className="text-text-muted text-xs font-bold uppercase tracking-wider">Total Vehicles</span>
            <span className="text-2xl font-bold text-white mt-2">{overview.totalVehicles}</span>
          </div>
          <div className="p-3 bg-accent/10 rounded-xl text-accent border border-accent/20">
            <Car className="w-5 h-5" />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex flex-col">
            <span className="text-text-muted text-xs font-bold uppercase tracking-wider">Active Bookings</span>
            <span className="text-2xl font-bold text-white mt-2">{overview.activeBookings}</span>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex flex-col">
            <span className="text-text-muted text-xs font-bold uppercase tracking-wider">Gross Income</span>
            <span className="text-2xl font-bold text-white mt-2">
              ₹{Number(overview.totalRevenue).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Velocity Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl flex flex-col gap-4 shadow-xl">
          <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
            <Landmark className="w-4 h-4 text-primary" />
            <span>Monthly Revenue Velocity</span>
          </h3>
          
          <div className="w-full h-72">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00dc82" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00dc82" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} labelStyle={{ color: 'white' }} />
                  <Area type="monotone" dataKey="Revenue" stroke="#00dc82" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                No revenue transaction datasets available.
              </div>
            )}
          </div>
        </div>

        {/* Fleet Distribution Pie Chart */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 shadow-xl">
          <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
            <Car className="w-4 h-4 text-primary" />
            <span>Fleet Utilization</span>
          </h3>
          
          <div className="w-full h-56 relative flex items-center justify-center">
            {pieData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                No active fleet distribution datasets.
              </div>
            )}
            
            {/* Center Summary Label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white">{overview.totalVehicles}</span>
              <span className="text-[10px] text-text-muted uppercase font-bold">Fleet Size</span>
            </div>
          </div>

          {/* Legends */}
          <div className="flex justify-around items-center text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary"></div>
              <span>Available ({vehicleStats.available || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-accent"></div>
              <span>Rented ({vehicleStats.rented || 0})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 shadow-xl overflow-hidden">
        <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
          <History className="w-4 h-4 text-primary" />
          <span>Recent Bookings activity</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-text-muted uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Renter Customer</th>
                <th className="py-3 px-4">Selected Vehicle</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4 text-right">Amount Charged</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">#VR-{b.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{b.customer_name}</td>
                    <td className="py-3.5 px-4">{b.brand} {b.model}</td>
                    <td className="py-3.5 px-4 font-mono text-text-muted">
                      {new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-white font-bold">
                      ₹{Number(b.total_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ${
                        b.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : b.status === 'confirmed'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : b.status === 'cancelled'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-text-muted">
                    No booking records registered on the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
