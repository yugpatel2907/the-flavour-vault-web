'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Calendar, Users, CheckCircle2, Flame, Award, Heart } from 'lucide-react';

export default function FooterReservation() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '2',
    date: '',
    time: '19:00',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', guests: '2', date: '', time: '19:00' });
    }, 4000);
  };

  return (
    <footer id="reservations" className="relative z-10 w-full bg-[#050506] border-t border-gold/20 text-gold-light font-sans select-none">
      {/* Reservation Section */}
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-12 border-b border-gold/15">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Reservation Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#120F14] border border-gold/30 mb-4">
              <Calendar className="w-3.5 h-3.5 text-saffron" />
              <span className="text-[11px] tracking-[0.35em] text-gold-muted uppercase font-serif font-bold">
                TABLE RESERVATIONS
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gold-gradient tracking-tight">
              RESERVE YOUR ROYAL TABLE
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-gold-light/80 leading-relaxed font-sans max-w-lg">
              Immerse yourself in 5-star royal Hyderabadi dining. Experience ancient clay handi dum biryani slow-cooked over wood fire embers.
            </p>

            <div className="mt-8 space-y-4 text-xs font-serif text-gold-muted">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-saffron" />
                <span>Near VIT College, Opp To. Life Cell Company, Kelakottiyur, Chennai</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-saffron" />
                <span>+91 94442 54893 / +91 82205 80524</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-saffron" />
                <span>LUNCH: 11:30 — 16:00 | DINNER: 18:30 — 23:00</span>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#120F14]/90 border border-gold/40 shadow-2xl backdrop-blur-xl">
            {isSubmitted ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-gold mx-auto animate-bounce mb-4" />
                <h3 className="font-serif text-2xl font-bold text-gold-gradient mb-2">
                  RESERVATION REQUESTED!
                </h3>
                <p className="text-xs text-gold-light/80 max-w-xs mx-auto">
                  Our Maitre d' will call you shortly on {formData.phone} to confirm your table.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-gold uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">
                  BOOK YOUR DINING EXPERIENCE
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-serif uppercase tracking-widest text-gold-muted mb-1 font-bold">FULL NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0C] border border-gold/30 text-xs text-gold-light focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-serif uppercase tracking-widest text-gold-muted mb-1 font-bold">PHONE NUMBER</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 Mobile"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0C] border border-gold/30 text-xs text-gold-light focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-serif uppercase tracking-widest text-gold-muted mb-1 font-bold">GUESTS</label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0C] border border-gold/30 text-xs text-gold-light focus:outline-none focus:border-gold"
                    >
                      {[1, 2, 4, 6, 8, 10, 15].map((num) => (
                        <option key={num} value={num}>{num} Guests</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-serif uppercase tracking-widest text-gold-muted mb-1 font-bold">DATE</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0C] border border-gold/30 text-xs text-gold-light focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-serif uppercase tracking-widest text-gold-muted mb-1 font-bold">TIME</label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0C] border border-gold/30 text-xs text-gold-light focus:outline-none focus:border-gold"
                    >
                      {['12:30', '13:30', '19:00', '20:00', '21:00'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-serif text-xs tracking-[0.25em] uppercase font-bold shadow-xl shadow-saffron/30 hover:scale-[1.01] transition-all mt-4"
                >
                  CONFIRM ROYAL RESERVATION
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-serif text-gold-muted">
        <div>
          © 2026 AMBROCIA'S RESTAURANT. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-2">
          <span>AUTHENTIC HYDERABADI GASTRONOMY</span>
          <span>•</span>
          <span>CHENNAI</span>
        </div>
      </div>
    </footer>
  );
}
