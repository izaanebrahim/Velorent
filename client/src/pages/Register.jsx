import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' or 'owner'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!/\d/.test(password)) {
      toast.error('Password must contain at least one number');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await register(name, email, phone, password, role);
      if (result.success) {
        toast.success('Registration successful! Welcome to VeloRent.');
        navigate('/');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-28 pb-12 px-6">
      {/* Background blobs */}
      <div className="absolute top-[20%] left-[20%] w-72 h-72 rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[20%] w-96 h-96 rounded-full bg-accent/15 blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl z-10 flex flex-col gap-6 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
            <Car className="w-7 h-7 stroke-[2.5]" />
            <span>VeloRent</span>
          </Link>
          <h2 className="text-xl font-bold text-white mt-4">Create Account</h2>
          <p className="text-xs text-text-muted">Register to book rides or host your custom premium fleet.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Full Name</label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary/40 border-white/10 text-white placeholder-white/20 text-sm rounded-xl"
                required
              />
              <User className="absolute left-3 w-4 h-4 text-text-muted" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Email Address</label>
            <div className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary/40 border-white/10 text-white placeholder-white/20 text-sm rounded-xl"
                required
              />
              <Mail className="absolute left-3 w-4 h-4 text-text-muted" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Phone Number</label>
            <div className="relative flex items-center">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91-9876543210"
                className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary/40 border-white/10 text-white placeholder-white/20 text-sm rounded-xl"
              />
              <Phone className="absolute left-3 w-4 h-4 text-text-muted" />
            </div>
          </div>

          {/* Account Role Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Register As</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center gap-2 justify-center p-3 rounded-xl border cursor-pointer select-none transition-all ${
                role === 'customer'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-white/10 bg-bg-secondary/20 text-text-muted hover:border-white/20'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === 'customer'}
                  onChange={() => setRole('customer')}
                  className="hidden"
                />
                <User className="w-4 h-4" />
                <span className="text-xs font-bold">Renter</span>
              </label>

              <label className={`flex items-center gap-2 justify-center p-3 rounded-xl border cursor-pointer select-none transition-all ${
                role === 'owner'
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-white/10 bg-bg-secondary/20 text-text-muted hover:border-white/20'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={role === 'owner'}
                  onChange={() => setRole('owner')}
                  className="hidden"
                />
                <Shield className="w-4 h-4" />
                <span className="text-xs font-bold">Fleet Owner</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-10 py-2.5 bg-bg-secondary/40 border-white/10 text-white placeholder-white/20 text-sm rounded-xl"
                required
              />
              <Lock className="absolute left-3 w-4 h-4 text-text-muted" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-text-muted hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Confirm Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary/40 border-white/10 text-white placeholder-white/20 text-sm rounded-xl"
                required
              />
              <Lock className="absolute left-3 w-4 h-4 text-text-muted" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-2.5 rounded-xl font-bold mt-4 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-text-muted mt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
