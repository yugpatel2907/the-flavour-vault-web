'use client';

import React, { createContext, useContext, useState, useRef } from 'react';
import { MenuItem } from '@/data/ambrociaMenu';
import { CartAction, validateCartAction } from '@/lib/cartActions';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, openDrawer?: boolean) => void;
  getCartSnapshot: () => { itemId: string; quantity: number }[];
  applyAIAction: (action: CartAction) => { success: boolean; message: string };
  refreshCartMenu: (items: MenuItem[]) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, nextQuantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const cartRef = useRef(cart);
  const appliedActions = useRef(new Set<string>());
  const [isCartOpen, setIsCartOpen] = useState(false);

  const commitCart = (next: CartItem[]) => { cartRef.current = next; setCart(next); };
  const addToCart = (item: MenuItem, quantity = 1, openDrawer = true) => {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) return;
    const existing = cartRef.current.find(line => line.menuItem.id === item.id);
    if (existing && existing.quantity + quantity > 50) return;
    commitCart(existing
      ? cartRef.current.map(line => line.menuItem.id === item.id ? { menuItem: item, quantity: line.quantity + quantity } : line)
      : [...cartRef.current, { menuItem: item, quantity }]);
    if (openDrawer) setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    commitCart(cartRef.current.filter((i) => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, nextQuantity: number) => {
    if (!Number.isInteger(nextQuantity) || nextQuantity < 0 || nextQuantity > 50) return;
    commitCart(cartRef.current
        .map((i) => {
          if (i.menuItem.id === itemId) {
            const safeQty = Math.max(0, nextQuantity);
            return safeQty > 0 ? { ...i, quantity: safeQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]);
  };

  const clearCart = () => commitCart([]);
  const getCartSnapshot = () => cartRef.current.map(line => ({ itemId: line.menuItem.id, quantity: line.quantity }));
  const refreshCartMenu = (items: MenuItem[]) => commitCart(cartRef.current.map(line => {
    const authoritative = items.find(item => item.id === line.menuItem.id);
    return authoritative ? { ...line, menuItem: authoritative } : line;
  }));
  const applyAIAction = (action: CartAction) => {
    if (!action || typeof action.id !== 'string') return { success: false, message: 'The cart action was invalid.' };
    if (appliedActions.current.has(action.id)) return { success: true, message: 'This action was already applied.' };
    const error = validateCartAction(cartRef.current, action);
    if (error) return { success: false, message: error };
    if (action.kind === 'add') addToCart(action.item, action.quantity, false);
    if (action.kind === 'update') { refreshCartMenu([action.item]); updateQuantity(action.item.id, action.quantity!); }
    if (action.kind === 'remove') removeFromCart(action.item.id);
    appliedActions.current.add(action.id);
    return { success: true, message: 'Your cart has been updated.' };
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        getCartSnapshot,
        applyAIAction,
        refreshCartMenu,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
