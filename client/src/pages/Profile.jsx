import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, Award, CheckCircle, Upload, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [licenseUrl, setLicenseUrl] = useState(user?.license_url || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await updateProfile({ name, phone, license_url: licenseUrl });
      if (result.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  // Mock license upload helper
  const handleUploadLicenseMock = () => {
    const mockUrls = [
      'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400',
      'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400'
    ];
    const randomUrl = mockUrls[Math.floor(Math.random() * mockUrls.length)];
    setLicenseUrl(randomUrl);
    toast.success('Driver License uploaded successfully (Mock Mode)');
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-4xl mx-auto w-full min-h-screen">
      <div className="flex flex-col gap-8 animate-fade-in">
        
        {/* Page Title */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">Account Settings</h1>
          <p className="text-text-muted">Manage your profile, view credentials, and upload rental permissions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Card Summary */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center gap-4 h-fit">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-extrabold text-3xl border border-primary/20 shadow-lg">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white">{user?.name}</h3>
              <span className="text-xs uppercase tracking-widest text-primary font-bold">{user?.role}</span>
            </div>

            <div className="w-full flex flex-col gap-2 pt-4 border-t border-white/5 text-xs text-text-muted text-left">
              <div className="flex justify-between">
                <span>Account Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 fill-emerald-500/10" />
                  <span>Active</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Joined Date:</span>
                <span className="text-white font-mono">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Form Card */}
          <div className="md:col-span-2 glass-panel p-8 rounded-3xl flex flex-col gap-6 shadow-xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span>Personal Information</span>
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Full Name</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary/40 border-white/10 text-white text-sm rounded-xl"
                      required
                    />
                    <User className="absolute left-3 w-4 h-4 text-text-muted" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Phone Number</label>
                  <div className="relative flex items-center">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary/40 border-white/10 text-white text-sm rounded-xl"
                    />
                    <Phone className="absolute left-3 w-4 h-4 text-text-muted" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Email Address</label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary/20 border-white/5 text-text-muted text-sm rounded-xl cursor-not-allowed"
                  />
                  <Mail className="absolute left-3 w-4 h-4 text-white/20" />
                </div>
                <span className="text-[10px] text-text-muted">Email address cannot be changed for security purposes.</span>
              </div>

              {/* License Upload Section */}
              <div className="flex flex-col gap-1.5 pt-4 border-t border-white/5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-primary" />
                  <span>Driver License (Required for renting)</span>
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {licenseUrl ? (
                    <div className="w-24 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-bg-secondary">
                      <img src={licenseUrl} alt="License preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center text-text-muted shrink-0 text-[10px]">
                      No License
                    </div>
                  )}

                  <div className="flex-grow flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleUploadLicenseMock}
                      className="btn btn-glass px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer w-fit"
                    >
                      <Upload className="w-3.5 h-3.5 text-primary" />
                      <span>{licenseUrl ? 'Re-upload License' : 'Upload Driver License'}</span>
                    </button>
                    {licenseUrl && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 fill-emerald-500/10" />
                        <span>License Uploaded & Validated</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary py-2.5 rounded-xl font-bold mt-4 flex items-center justify-center gap-2 cursor-pointer w-fit self-end"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving Changes...' : 'Save Settings'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
