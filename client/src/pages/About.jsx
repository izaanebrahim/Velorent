import React from 'react';
import { ShieldCheck, Target, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full min-h-[70vh]">
      <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-6">About VeloRent</h1>
        <p className="text-lg text-text-muted leading-relaxed">
          VeloRent is a premium vehicle rental management platform built to provide both operators and customers with a seamless, high-end experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Target className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-text-main mb-3">Our Mission</h3>
          <p className="text-sm text-text-muted leading-relaxed">
            To streamline the vehicle rental industry with cutting-edge software that guarantees reliability, transparency, and style.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-text-main mb-3">Premium Fleet</h3>
          <p className="text-sm text-text-muted leading-relaxed">
            Every vehicle in our catalog undergoes rigorous inspection and maintenance to ensure a flawless driving experience.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-text-main mb-3">Customer First</h3>
          <p className="text-sm text-text-muted leading-relaxed">
            We put the customer at the center of everything we do, offering 24/7 support and flexible booking options.
          </p>
        </div>
      </div>
    </div>
  );
}
