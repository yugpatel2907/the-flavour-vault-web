'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Plus, Minus, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'customer' | 'done'>('review');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'dinein'>('delivery');
  const [tableNumber, setTableNumber] = useState('');

  if (!isCartOpen) return null;

  const close = () => {
    setCheckoutStep('review');
    setIsCartOpen(false);
  };

  const completeDemo = () => {
    if (cart.length === 0) return;
    if (!customerPhone.trim()) {
      alert('Please provide your mobile number.');
      return;
    }

    if (orderType === 'delivery' && !customerAddress.trim()) {
      alert('Please provide the delivery address.');
      return;
    }

    if (orderType === 'dinein' && !tableNumber.trim()) {
      alert('Please provide the table number for dine-in.');
      return;
    }

    // Demonstration only: no network request, storage, payment or order creation.
    setCheckoutStep('done');
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="cart-title" className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={close}
        className="absolute inset-0 bg-[#0A0A0C]/85 backdrop-blur-md transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#120F14] border-l border-gold/30 shadow-2xl text-gold-light flex flex-col justify-between p-6 overflow-y-auto">
          
          {/* Drawer Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-gold/20">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h2 id="cart-title" className="font-serif text-xl font-bold tracking-wider text-gold-gradient uppercase">
                  YOUR ORDER ({totalItems})
                </h2>
              </div>
              <button
                aria-label="Close cart"
                onClick={close}
                className="w-8 h-8 rounded-full bg-[#0A0A0C] border border-gold/30 flex items-center justify-center text-gold-muted hover:text-gold transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-4 text-xs text-gold-muted" role="note">Demo checkout — orders are not sent or saved. Do not enter real personal details.</p>

            {/* Demo completion view */}
            {checkoutStep === 'done' ? (
              <div className="py-16 text-center">
                <CheckCircle2 className="w-16 h-16 text-gold mx-auto animate-bounce mb-4" />
                <h3 className="font-serif text-2xl font-bold text-gold-gradient mb-2">
                  DEMO CHECKOUT COMPLETE
                </h3>
                <p className="text-xs text-gold-light/80 leading-relaxed max-w-xs mx-auto font-sans">
                  No order was sent or saved, and no payment was taken. Your cart is still available. Call +91 94442 54893 to place a real order.
                </p>
                <button
                  onClick={() => setCheckoutStep('review')}
                  className="mt-5 px-4 py-2 rounded-full border border-gold/30 text-[10px] font-serif uppercase tracking-[0.25em] text-gold-muted hover:text-gold transition-colors"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-20 text-center text-gold-muted">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 stroke-1" />
                <p className="font-serif text-sm uppercase tracking-widest">YOUR CART IS EMPTY</p>
                <p className="text-xs mt-1 text-gold-muted/60">Add items from the menu to build your order.</p>
                <button
                  onClick={close}
                  className="mt-6 px-5 py-2.5 rounded-full border border-gold/30 bg-[#0A0A0C] text-[10px] font-serif uppercase tracking-[0.25em] text-gold hover:text-gold-light transition-colors"
                >
                  CONTINUE SHOPPING
                </button>
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
                        <span title={item.menuItem.isVeg === null ? 'Dietary details unavailable' : item.menuItem.isVeg ? 'Vegetarian' : 'Non-vegetarian'} className={`w-2 h-2 rounded-full ${item.menuItem.isVeg === null ? 'bg-gold-muted' : item.menuItem.isVeg ? 'bg-gold' : 'bg-rose-500'}`} />
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
                        aria-label={`Decrease quantity of ${item.menuItem.name}`}
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gold/20 text-gold transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-serif text-xs font-bold px-1">{item.quantity}</span>
                      <button
                        aria-label={`Increase quantity of ${item.menuItem.name}`}
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gold/20 text-gold transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      aria-label={`Remove ${item.menuItem.name} from cart`}
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
          {cart.length > 0 && checkoutStep !== 'done' && (
            <div className="pt-6 border-t border-gold/20 space-y-4">
              <div className="flex justify-between items-center font-serif">
                <span className="text-xs uppercase tracking-widest text-gold-muted">SUBTOTAL</span>
                <span className="text-2xl font-extrabold text-gold-gradient">₹{totalAmount}</span>
              </div>

              {checkoutStep === 'review' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={close}
                    className="py-3 px-4 rounded-xl bg-[#0A0A0C] border border-gold/20 text-xs font-serif uppercase tracking-wider text-gold-muted hover:text-gold transition-colors"
                  >
                    CONTINUE SHOPPING
                  </button>

                  <button
                    onClick={clearCart}
                    className="py-3 px-4 rounded-xl bg-[#0A0A0C] border border-gold/20 text-xs font-serif uppercase tracking-wider text-gold-muted hover:text-gold transition-colors"
                  >
                    CLEAR
                  </button>

                  <button
                    onClick={() => setCheckoutStep('customer')}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-serif text-xs tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-saffron/30 hover:scale-[1.02]"
                  >
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              )}

              {checkoutStep === 'customer' && (
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] text-gold-muted font-bold">Order Type</span>
                    <div className="mt-2 flex gap-2">
                      <label className={`px-3 py-2 rounded-full border ${orderType === 'delivery' ? 'bg-gold/20 border-gold' : 'border-gold/20 text-gold-muted'}`}>
                        <input type="radio" name="orderType" checked={orderType === 'delivery'} onChange={() => setOrderType('delivery')} className="hidden" /> Delivery
                      </label>
                      <label className={`px-3 py-2 rounded-full border ${orderType === 'dinein' ? 'bg-gold/20 border-gold' : 'border-gold/20 text-gold-muted'}`}>
                        <input type="radio" name="orderType" checked={orderType === 'dinein'} onChange={() => setOrderType('dinein')} className="hidden" /> Dine-in (table)
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="demo-phone" className="text-[11px] text-gold-muted">Phone (demo)</label>
                    <input id="demo-phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full mt-1 p-2 rounded bg-[#0A0A0C] border border-gold/20 text-gold-light text-sm" />
                  </div>

                  {orderType === 'delivery' && (
                    <div>
                      <label htmlFor="demo-address" className="text-[11px] text-gold-muted">Delivery Address (demo)</label>
                      <input id="demo-address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full mt-1 p-2 rounded bg-[#0A0A0C] border border-gold/20 text-gold-light text-sm" />
                    </div>
                  )}

                  {orderType === 'dinein' && (
                    <div>
                      <label htmlFor="demo-table" className="text-[11px] text-gold-muted">Table Number (demo)</label>
                      <input id="demo-table" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="w-full mt-1 p-2 rounded bg-[#0A0A0C] border border-gold/20 text-gold-light text-sm" />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button onClick={() => setCheckoutStep('review')} className="py-3 px-4 rounded-xl bg-[#0A0A0C] border border-gold/20 text-xs font-serif uppercase tracking-wider text-gold-muted hover:text-gold transition-colors">BACK</button>
                    <button onClick={completeDemo} className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-saffron via-saffron-light to-gold text-[#0A0A0C] font-serif text-xs tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-saffron/30 hover:scale-[1.02]">COMPLETE DEMO CHECKOUT</button>
                  </div>
                </div>
              )}


            </div>
          )}
        </div>
      </div>
    </div>
  );
}
