import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, Calendar, Check, Landmark, Smartphone, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Booking() {
  const { vehicleId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // Steps: 1 = Review, 2 = Payment, 3 = Confirmation
  
  // Date params
  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '');
  const [endDate, setEndDate] = useState(searchParams.get('end_date') || '');
  const [daysCount, setDaysCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Checkout details
  const [pickupLocation, setPickupLocation] = useState('VeloRent Hub, Airport Road, Mumbai');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await api.get(`/vehicles/${vehicleId}`);
        if (response.data && response.data.success) {
          setVehicle(response.data.data);
        }
      } catch (error) {
        console.error('Failed to get checkout vehicle:', error);
        toast.error('Vehicle not found');
        navigate('/vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicleId, navigate]);

  useEffect(() => {
    if (startDate && endDate && vehicle) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end > start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysCount(diffDays);
        setTotalAmount(diffDays * vehicle.price_per_day);
      } else {
        setDaysCount(0);
        setTotalAmount(0);
      }
    }
  }, [startDate, endDate, vehicle]);

  const handleNextStep = () => {
    if (!startDate || !endDate || daysCount <= 0) {
      toast.error('Please configure valid pickup and return dates.');
      return;
    }
    if (!pickupLocation) {
      toast.error('Please specify a pickup location.');
      return;
    }
    setStep(2);
  };

  const handleProcessBooking = async () => {
    setSubmitting(true);
    try {
      // 1. Create booking in pending status
      const bookingResponse = await api.post('/bookings', {
        vehicle_id: Number(vehicleId),
        start_date: startDate,
        end_date: endDate,
        pickup_location: pickupLocation,
        notes: notes
      });

      if (bookingResponse.data && bookingResponse.data.success) {
        const bookedData = bookingResponse.data.data;
        setBookingId(bookedData.id);

        // 2. Process mock payment
        const paymentResponse = await api.post('/payments', {
          booking_id: bookedData.id,
          method: paymentMethod
        });

        if (paymentResponse.data && paymentResponse.data.success) {
          setTransactionId(paymentResponse.data.data.transaction_id);
          setStep(3);
          toast.success('Vehicle booked successfully!');
        } else {
          toast.error(paymentResponse.data.message || 'Payment simulation failed.');
        }
      } else {
        toast.error(bookingResponse.data.message || 'Booking submission failed.');
      }
    } catch (error) {
      console.error('Booking submission failed:', error);
      toast.error(error.response?.data?.message || 'Date conflict! Selected dates are already booked.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 w-full flex items-center justify-center min-h-[70vh]">
        <div className="text-primary font-bold animate-pulse text-lg">Initializing checkout workspace...</div>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto w-full min-h-screen">
      <div className="flex flex-col gap-8 animate-fade-in">
        
        {/* Checkout Header / Stepper Progress */}
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Checkout</h1>
            <p className="text-text-muted text-sm">Secure your booking details below.</p>
          </div>
          
          {/* Stepper Progress Bar */}
          <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
            <span className={`px-3 py-1.5 rounded-full ${step >= 1 ? 'bg-primary text-black' : 'bg-white/5'}`}>1. Review</span>
            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-white/10'}`}></div>
            <span className={`px-3 py-1.5 rounded-full ${step >= 2 ? 'bg-primary text-black' : 'bg-white/5'}`}>2. Pay</span>
            <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-white/10'}`}></div>
            <span className={`px-3 py-1.5 rounded-full ${step >= 3 ? 'bg-primary text-black' : 'bg-white/5'}`}>3. Done</span>
          </div>
        </div>

        {/* Step 1: Review details & location */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Vehicle review box */}
              <div className="glass-panel p-6 rounded-3xl flex gap-6 shadow-xl">
                <div className="w-36 h-24 rounded-xl overflow-hidden bg-bg-secondary border border-white/5 shrink-0">
                  <img src={vehicle.image_url} alt={vehicle.model} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] text-primary uppercase font-bold tracking-wider">{vehicle.brand}</span>
                  <h3 className="text-lg font-extrabold text-white">{vehicle.brand} {vehicle.model}</h3>
                  <span className="text-xs text-text-muted mt-1 capitalize">{vehicle.type} • {vehicle.transmission} • {vehicle.fuel_type}</span>
                </div>
              </div>

              {/* Booking form details */}
              <div className="glass-panel p-8 rounded-3xl flex flex-col gap-6 shadow-xl">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Configure Rental Dates</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Pickup Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-bg-secondary border-white/10 text-white rounded-xl text-sm"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Return Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-bg-secondary border-white/10 text-white rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Pickup Location</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Provide address / pickup hub location"
                    className="w-full px-4 py-2.5 bg-bg-secondary border-white/10 text-white text-sm rounded-xl"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Additional Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Flight arrival details, delivery directions..."
                    rows="3"
                    className="w-full px-4 py-2.5 bg-bg-secondary border-white/10 text-white text-sm rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Right breakdown card */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-8 rounded-3xl flex flex-col gap-6 shadow-2xl lg:sticky lg:top-24">
                <h2 className="text-xl font-bold text-white pb-3 border-b border-white/5">Price Details</h2>
                
                <div className="flex flex-col gap-4 text-sm text-text-muted">
                  <div className="flex justify-between items-center">
                    <span>Daily Rate</span>
                    <span className="font-mono text-white font-semibold">₹{Number(vehicle.price_per_day).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Duration</span>
                    <span className="font-mono text-white font-semibold">{daysCount} Days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Base Amount</span>
                    <span className="font-mono text-white font-semibold">₹{Number(totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>GST Tax (18%)</span>
                    <span className="font-mono text-white font-semibold">₹{(totalAmount * 0.18).toLocaleString('en-IN')}</span>
                  </div>
                  <hr className="border-white/5" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-base">Total Charge</span>
                    <span className="font-mono text-primary font-bold text-xl">₹{(totalAmount * 1.18).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full btn btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Payment flow method */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Payment selector */}
              <div className="glass-panel p-8 rounded-3xl flex flex-col gap-6 shadow-xl">
                <h2 className="text-xl font-bold text-white pb-3 border-b border-white/5">Select Payment Method</h2>
                
                <div className="grid grid-cols-3 gap-4">
                  <label className={`flex flex-col items-center justify-center p-5 rounded-2xl border cursor-pointer select-none transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-white/10 bg-bg-secondary/20 text-text-muted hover:border-white/20'
                  }`}>
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                    <Smartphone className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold uppercase">UPI</span>
                  </label>

                  <label className={`flex flex-col items-center justify-center p-5 rounded-2xl border cursor-pointer select-none transition-all ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-white/10 bg-bg-secondary/20 text-text-muted hover:border-white/20'
                  }`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                    <CreditCard className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold uppercase">Cards</span>
                  </label>

                  <label className={`flex flex-col items-center justify-center p-5 rounded-2xl border cursor-pointer select-none transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-white/10 bg-bg-secondary/20 text-text-muted hover:border-white/20'
                  }`}>
                    <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} className="hidden" />
                    <Landmark className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold uppercase">Net Bank</span>
                  </label>
                </div>

                {/* Form fields depending on method */}
                <div className="p-6 bg-bg-secondary/40 rounded-2xl border border-white/5 mt-4">
                  {paymentMethod === 'upi' && (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Enter UPI ID</label>
                      <input
                        type="text"
                        placeholder="e.g. username@upi"
                        className="w-full px-4 py-2.5 bg-bg-secondary border-white/10 text-white rounded-xl text-sm"
                      />
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Cardholder Name</label>
                        <input type="text" placeholder="Rahul Sharma" className="w-full px-4 py-2.5 bg-bg-secondary border-white/10 text-white rounded-xl text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Card Number</label>
                        <input type="text" placeholder="4111 2222 3333 4444" className="w-full px-4 py-2.5 bg-bg-secondary border-white/10 text-white rounded-xl text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Expiry (MM/YY)</label>
                          <input type="text" placeholder="12/28" className="w-full px-4 py-2.5 bg-bg-secondary border-white/10 text-white rounded-xl text-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">CVV</label>
                          <input type="text" placeholder="123" className="w-full px-4 py-2.5 bg-bg-secondary border-white/10 text-white rounded-xl text-sm" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Bank</label>
                      <select className="w-full px-4 py-2.5 bg-bg-secondary border-white/10 text-white rounded-xl text-sm">
                        <option>State Bank of India</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price review checkout box */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-8 rounded-3xl flex flex-col gap-6 shadow-2xl lg:sticky lg:top-24">
                <h2 className="text-xl font-bold text-white pb-3 border-b border-white/5">Order Overview</h2>
                
                <div className="flex flex-col gap-4 text-sm text-text-muted">
                  <div className="flex justify-between items-center text-xs">
                    <span>Base Fare ({daysCount} days)</span>
                    <span className="font-mono text-white font-semibold">₹{Number(totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>GST (18%)</span>
                    <span className="font-mono text-white font-semibold">₹{(totalAmount * 0.18).toLocaleString('en-IN')}</span>
                  </div>
                  <hr className="border-white/5" />
                  <div className="flex justify-between items-center text-white font-bold">
                    <span>Amount Due</span>
                    <span className="font-mono text-primary font-bold text-lg">₹{(totalAmount * 1.18).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <button
                    onClick={handleProcessBooking}
                    disabled={submitting}
                    className="w-full btn btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{submitting ? 'Processing Payment...' : 'Pay & Confirm Booking'}</span>
                    <ShieldCheck className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setStep(1)}
                    disabled={submitting}
                    className="w-full btn btn-glass py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success Confirmation */}
        {step === 3 && (
          <div className="max-w-xl mx-auto w-full glass-panel p-8 rounded-3xl text-center flex flex-col items-center gap-6 shadow-2xl border border-primary/20">
            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white">Booking Confirmed!</h2>
              <p className="text-text-muted text-xs mt-1">Thank you for riding with VeloRent. Your order has been registered.</p>
            </div>

            {/* Reciept specs */}
            <div className="w-full bg-bg-secondary/40 border border-white/5 rounded-2xl p-6 text-left text-xs text-text-muted flex flex-col gap-3 font-mono">
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="text-white font-bold">{transactionId || 'TXN_SIMULATED_2026'}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking Reference:</span>
                <span className="text-white font-bold">#VR-{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span>Vehicle Model:</span>
                <span className="text-white font-bold">{vehicle.brand} {vehicle.model}</span>
              </div>
              <div className="flex justify-between">
                <span>Pickup Location:</span>
                <span className="text-white font-bold truncate max-w-[200px]">{pickupLocation}</span>
              </div>
              <hr className="border-white/5" />
              <div className="flex justify-between text-white font-bold">
                <span>Total Amount Charged:</span>
                <span className="text-primary font-mono font-bold">₹{(totalAmount * 1.18).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
              <button
                onClick={() => navigate('/bookings')}
                className="btn btn-primary py-2.5 rounded-xl font-bold flex-grow cursor-pointer"
              >
                Go to My Bookings
              </button>
              <button
                onClick={() => navigate('/vehicles')}
                className="btn btn-glass py-2.5 rounded-xl font-bold flex-grow cursor-pointer"
              >
                Browse More Fleet
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
