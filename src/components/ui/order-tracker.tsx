'use client';

import React, { useState, useEffect } from 'react';
import { Clock, X, ChefHat, CheckCircle2, Flame, Bike, Sparkles } from 'lucide-react';

interface OrderTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderTracker({ isOpen, onClose }: OrderTrackerProps) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    { id: 1, title: 'ORDER RECEIVED', desc: 'Kitchen ticket generated & spices weighed.', icon: Clock },
    { id: 2, title: 'SLOW DUM COOKING', desc: 'Sealed in handi over charcoal embers.', icon: Flame },
    { id: 3, title: 'QUALITY CHECKS', desc: 'Aroma & temperature verified by Master Chef.', icon: ChefHat },
    { id: 4, title: 'EXPRESS DISPATCH', desc: 'Out for thermal insulated delivery.', icon: Bike },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0C]/85 backdrop-blur-md font-sans select-none">
      <div className="relative w-full max-w-xl bg-[#120F14] border border-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-gold-light">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-gold/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold shadow-lg">
              <Clock className="w-5 h-5 text-saffron" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-gold-gradient tracking-wider uppercase">
                LIVE KITCHEN TELEMETRY
              </h2>
              <p className="text-[11px] text-gold-muted/80">Real-time Hyderabadi Dum biryani status</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0A0A0C] border border-gold/30 flex items-center justify-center text-gold-muted hover:text-gold transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Telemetry Timeline */}
        <div className="py-8 space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-start gap-4 relative">
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 border ${
                      isCompleted
                        ? 'bg-saffron text-[#0A0A0C] border-saffron shadow-lg'
                        : isCurrent
                        ? 'bg-gold text-[#0A0A0C] border-gold ring-4 ring-gold/30 scale-110 shadow-xl'
                        : 'bg-[#0A0A0C] border-gold/20 text-gold-muted/40'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                </div>

                <div className="flex-1 pt-1">
                  <h4 className={`font-serif text-sm font-bold tracking-wider uppercase ${isCurrent ? 'text-gold' : isCompleted ? 'text-gold-light' : 'text-gold-muted/50'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-gold-muted/80 mt-0.5 font-sans leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-gold/20 flex justify-between items-center text-xs font-serif text-gold-muted">
          <span>ESTIMATED DUM TIME: 25 MINS</span>
          <span className="text-gold font-bold uppercase tracking-wider">CHENNAI KITCHEN #01</span>
        </div>
      </div>
    </div>
  );
}
