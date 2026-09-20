import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirection handling
  const redirect = searchParams.get('redirect') || '/';
  const expired = searchParams.get('expired') === 'true';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  useEffect(() => {
    if (expired) {
      toast.error('Session expired. Please log in again.');
    }
  }, [expired]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('Welcome back to VeloRent!');
        navigate(redirect);
      } else {
        toast.error(result.message || 'Invalid email or password');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-6">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[20%] left-[20%] w-72 h-72 rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[20%] w-96 h-96 rounded-full bg-accent/15 blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl z-10 flex flex-col gap-6 shadow-2xl animate-fade-in">
        {/* Logo Title */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
            <Car className="w-7 h-7 stroke-[2.5]" />
            <span>VeloRent</span>
          </Link>
          <h2 className="text-xl font-bold text-white mt-4">Welcome Back</h2>
          <p className="text-xs text-text-muted">Enter your credentials to manage your fleet or book bookings.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          {/* Remember me & Forget Password */}
          <div className="flex justify-between items-center text-xs font-medium mt-1">
            <label className="flex items-center gap-2 text-text-muted cursor-pointer">
              <input type="checkbox" className="rounded accent-primary bg-bg-secondary/50 border-white/10" />
              <span>Remember me</span>
            </label>
            <a href="#" onClick={(e) => { e.preventDefault(); toast('Password reset link coming soon'); }} className="text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-2.5 rounded-xl font-bold mt-4 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-text-muted mt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-bold">
            Create Account
          </Link>
        </div>

        {/* Demo Credentials Alert */}
        <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-text-muted flex flex-col gap-2">
          <div className="font-bold text-white uppercase text-[10px] tracking-wider text-primary">Demo Access Logins</div>
          <div>Customer: <span className="text-white font-mono">rahul@email.com</span> / password: <span className="text-white font-mono">Admin@123</span></div>
          <div>Admin: <span className="text-white font-mono">admin@velorent.com</span> / password: <span className="text-white font-mono">Admin@123</span></div>
        </div>
      </div>
    </div>
  );
}
