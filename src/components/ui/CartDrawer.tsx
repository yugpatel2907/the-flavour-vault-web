'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Plus, Minus, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderPlaced(true);
      setTimeout(() => {
        setOrderPlaced(false);
        clearCart();
        setIsCartOpen(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-[#0A0A0C]/85 backdrop-blur-md transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#120F14] border-l border-gold/30 shadow-2xl text-gold-light flex flex-col justify-between p-6 overflow-y-auto">
          
          {/* Drawer Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-gold/20">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h2 className="font-serif text-xl font-bold tracking-wider text-gold-gradient uppercase">
                  YOUR ORDER ({totalItems})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-[#0A0A0C] border border-gold/30 flex items-center justify-center text-gold-muted hover:text-gold transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Order Placed Success View */}
            {orderPlaced ? (
              <div className="py-16 text-center">
                <CheckCircle2 className="w-16 h-16 text-gold mx-auto animate-bounce mb-4" />
                <h3 className="font-serif text-2xl font-bold text-gold-gradient mb-2">
                  ORDER CONFIRMED!
                </h3>
                <p className="text-xs text-gold-light/80 leading-relaxed max-w-xs mx-auto font-sans">
                  Your authentic Hyderabadi feast is being prepared in charcoal wood-fired clay handis.
                </p>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-20 text-center text-gold-muted">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 stroke-1" />
                <p className="font-serif text-sm uppercase tracking-widest">YOUR CART IS EMPTY</p>
                <p className="text-xs mt-1 text-gold-muted/60">Add items from the menu to build your order.</p>
              </div>
            ) : (
              /* Cart Items List */
              <div className="py-6 space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="p-4 rounded-2xl bg-[#0A0A0C]/90 border border-gold/20 flex items-center justify-between gap-3 shadow-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${item.menuItem.isVeg ? 'bg-gold' : 'bg-rose-500'}`} />
                        <h4 className="font-serif text-sm font-bold text-gold-light line-clamp-1">
                          {item.menuItem.name}
                        </h4>
                      </div>
                      <div className="font-serif text-xs font-bold text-gold-gradient">
                        ₹{item.menuItem.price} × {item.quantity} = ₹{item.menuItem.price * item.quantity}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-[#120F14] p-1.5 rounded-full border border-gold/30">
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gold/20 text-gold transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-serif text-xs font-bold px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gold/20 text-gold transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.menuItem.id)}
                      className="text-gold-muted/50 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && !orderPlaced && (
            <div className="pt-6 border-t border-gold/20 space-y-4">
              <div className="flex justify-between items-center font-serif">
                <span className="text-xs uppercase tracking-widest text-gold-muted">SUBTOTAL</span>
                <span className="text-2xl font-extrabold text-gold-gradient">₹{totalAmount}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearCart}
                  className="py-3 px-4 rounded-xl bg-[#0A0A0C] border border-gold/20 text-xs font-serif uppercase tracking-wider text-gold-muted hover:text-gold transition-colors"
                >
                  CLEAR
                </button>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-serif text-xs tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-saffron/30 hover:scale-[1.02]"
                >
                  {isCheckingOut ? (
                    <span>CONFIRMING...</span>
                  ) : (
                    <>
                      <span>PROCEED TO CHECKOUT</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
