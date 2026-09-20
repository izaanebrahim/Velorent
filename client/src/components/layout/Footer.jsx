import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg-secondary/40 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Info Column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary select-none">
            <Car className="w-6 h-6 stroke-[2.5]" />
            <span>VeloRent</span>
          </Link>
          <p className="text-text-muted text-sm leading-relaxed">
            Experience premium mobility with India's smartest vehicle rental platform. Elevate your journey today.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link to="/vehicles" className="text-text-muted hover:text-primary transition-colors">
                Explore Fleet
              </Link>
            </li>
            <li>
              <a href="#how-it-works" className="text-text-muted hover:text-primary transition-colors">
                How It Works
              </a>
            </li>
            <li>
              <Link to="/register" className="text-text-muted hover:text-primary transition-colors">
                Become a Partner
              </Link>
            </li>
            <li>
              <Link to="/bookings" className="text-text-muted hover:text-primary transition-colors">
                My Bookings
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Categories</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link to="/vehicles?category=Sports" className="text-text-muted hover:text-primary transition-colors">
                Sports Cars
              </Link>
            </li>
            <li>
              <Link to="/vehicles?category=Luxury" className="text-text-muted hover:text-primary transition-colors">
                Luxury Sedans
              </Link>
            </li>
            <li>
              <Link to="/vehicles?category=SUV" className="text-text-muted hover:text-primary transition-colors">
                SUVs & Off-road
              </Link>
            </li>
            <li>
              <Link to="/vehicles?category=Bike" className="text-text-muted hover:text-primary transition-colors">
                Superbikes & Scooters
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Get in Touch</h4>
          <div className="flex items-start gap-3 text-sm text-text-muted">
            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>123 Velo Heights, Bandra West, Mumbai, MH, 400050</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <span>+91 90000 00001</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <span>support@velorent.com</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>&copy; {new Date().getFullYear()} VeloRent. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
