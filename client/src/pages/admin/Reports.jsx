import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FileDown, RefreshCw, BarChart2, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stats');
      if (response.data && response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to get report analytics:', error);
      toast.error('Failed to fetch analytics datasets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportSimulate = () => {
    toast.loading('Compiling CSV logs...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Reports compiled! CSV download simulated successfully.');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full text-primary font-bold animate-pulse text-sm">
        Analyzing financial transactions database...
      </div>
    );
  }

  if (!stats) return null;

  const { monthlyRevenue, categoryStats } = stats;

  const barChartData = (categoryStats || []).map(item => ({
    name: item.category,
    Vehicles: Number(item.count)
  }));

  return (
    <div className="flex flex-col gap-8 animate-fade-in w-full">
      {/* Title Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Reports & Financial Analytics</h1>
          <p className="text-text-muted text-xs">Observe vehicle performance metrics and download transaction ledgers.</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleExportSimulate}
            className="btn btn-primary px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <FileDown className="w-4 h-4 text-black" />
            <span>Export CSV Ledger</span>
          </button>
          
          <button
            onClick={fetchReports}
            className="btn btn-glass px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Financial Indicators & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category breakdown bar charts */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 shadow-xl">
          <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
            <BarChart2 className="w-4 h-4 text-primary" />
            <span>Fleet Categories Distribution</span>
          </h3>
          
          <div className="w-full h-72">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} labelStyle={{ color: 'white' }} />
                  <Legend />
                  <Bar dataKey="Vehicles" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                No fleet models data loaded.
              </div>
            )}
          </div>
        </div>

        {/* Income Statements */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 shadow-xl">
          <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
            <IndianRupee className="w-4 h-4 text-primary" />
            <span>Monthly Income Ledger</span>
          </h3>

          <div className="overflow-y-auto max-h-72">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-text-muted uppercase font-bold tracking-wider">
                  <th className="py-2.5 px-3">Billing Cycle</th>
                  <th className="py-2.5 px-3 text-center">Transactions</th>
                  <th className="py-2.5 px-3 text-right">Income Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {monthlyRevenue && monthlyRevenue.length > 0 ? (
                  monthlyRevenue.map((r, i) => (
                    <tr key={i} className="hover:bg-white/2">
                      <td className="py-3 px-3 font-semibold">
                        {new Date(r.month + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        {r.transactions} Completed
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-primary">
                        ₹{Number(r.revenue).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-text-muted">
                      No monthly invoice registers.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
