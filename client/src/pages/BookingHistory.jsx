import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { History, Calendar, ArrowRight, DollarSign, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings');
      if (response.data && response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch booking history:', error);
      toast.error('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking? A refund will be issued to your payment method.')) {
      return;
    }

    try {
      const response = await api.put(`/bookings/${id}/cancel`);
      if (response.data && response.data.success) {
        toast.success('Booking cancelled and payment refunded successfully!');
        fetchBookings();
      } else {
        toast.error(response.data.message || 'Cancellation failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'active':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-white/5 text-text-muted border-white/10';
    }
  };

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case 'success':
        return 'text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded';
      case 'refunded':
        return 'text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded';
      default:
        return 'text-red-400 bg-red-500/5 px-2 py-0.5 rounded';
    }
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto w-full min-h-screen">
      <div className="flex flex-col gap-8 animate-fade-in">
        
        {/* Page Title */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">Booking History</h1>
          <p className="text-text-muted">Track your active, upcoming, and past reservations and invoices.</p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((n) => (
              <div key={n} className="glass-panel p-6 rounded-3xl h-44 animate-pulse flex gap-6">
                <div className="w-48 bg-white/5 rounded-2xl h-full"></div>
                <div className="flex-grow flex flex-col justify-between py-2">
                  <div className="bg-white/5 h-6 w-1/3 rounded"></div>
                  <div className="bg-white/5 h-4 w-1/4 rounded"></div>
                  <div className="bg-white/5 h-10 w-full rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-panel p-16 rounded-3xl text-center flex flex-col items-center gap-4">
            <History className="w-12 h-12 text-primary/50" />
            <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
            <p className="text-text-muted text-sm max-w-xs leading-relaxed">
              Looks like you haven't booked any premium vehicles yet. Ready to start your first journey?
            </p>
            <Link to="/vehicles" className="btn btn-primary px-6 py-2.5 rounded-full text-xs font-bold mt-2">
              Browse Fleet
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="glass-panel rounded-3xl overflow-hidden flex flex-col md:flex-row gap-6 p-6 shadow-xl hover:border-white/15 transition-all">
                {/* Vehicle image */}
                <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden shrink-0 bg-bg-secondary border border-white/5">
                  <img
                    src={booking.image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400'}
                    alt={`${booking.brand} ${booking.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Booking description content */}
                <div className="flex-grow flex flex-col justify-between gap-4 py-1">
                  
                  {/* Brand & Status Badges */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] text-primary uppercase font-bold tracking-widest">{booking.type}</span>
                      <h3 className="text-lg font-extrabold text-white">
                        {booking.brand} {booking.model}
                      </h3>
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Dates & Pickup */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-text-muted">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider">Pickup Date</span>
                      <span className="text-white font-medium flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {new Date(booking.start_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider">Return Date</span>
                      <span className="text-white font-medium flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {new Date(booking.end_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="col-span-2 md:col-span-1 flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider">Location</span>
                      <span className="text-white font-medium line-clamp-1">{booking.pickup_location || 'Main Center'}</span>
                    </div>
                  </div>

                  {/* Pricing and Transaction Invoice */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-white/5 text-xs text-text-muted">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span>Paid: <strong className="text-white font-mono">₹{Number(booking.total_amount).toLocaleString('en-IN')}</strong></span>
                      </div>
                      
                      {booking.payment_status && (
                        <div className="flex items-center gap-1">
                          <Receipt className="w-4 h-4 text-primary" />
                          <span>Status: <strong className={`font-mono uppercase font-bold ${getPaymentStatusStyle(booking.payment_status)}`}>{booking.payment_status}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Actions: Cancel or details link */}
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      {['pending', 'confirmed'].includes(booking.status) && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="btn border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs px-4 py-1.5 rounded-xl cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      )}
                      
                      <Link
                        to={`/vehicles/${booking.vehicle_id}`}
                        className="btn btn-glass text-xs px-4 py-1.5 rounded-xl flex items-center gap-1"
                      >
                        <span>Re-book</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
