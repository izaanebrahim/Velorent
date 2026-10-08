import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full min-h-[70vh]">
      <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-6">Contact Us</h1>
        <p className="text-lg text-text-muted leading-relaxed">
          Have a question or need assistance with your booking? Our dedicated team is here to help you 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="flex flex-col gap-8">
          <div className="glass-panel p-8 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-main mb-2">Our Office</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                VeloRent Headquarters<br />
                123 Business Avenue, Andheri East<br />
                Mumbai, Maharashtra 400069
              </p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-main mb-2">Phone Support</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                +91 98765 43210<br />
                Available 24/7 for emergency roadside assistance.
              </p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-main mb-2">Email Us</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                support@velorent.com<br />
                bookings@velorent.com
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-panel p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-text-main mb-6">Send us a message</h2>
          <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-bg-secondary border border-border-glass rounded-xl text-white focus:outline-none focus:border-primary transition-colors" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Email Address</label>
              <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-bg-secondary border border-border-glass rounded-xl text-white focus:outline-none focus:border-primary transition-colors" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Message</label>
              <textarea placeholder="How can we help you?" rows="4" className="w-full px-4 py-3 bg-bg-secondary border border-border-glass rounded-xl text-white focus:outline-none focus:border-primary transition-colors resize-none" required></textarea>
            </div>
            <button type="submit" className="btn-primary py-3 rounded-xl font-bold mt-2">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
