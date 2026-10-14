import type { MenuItem } from '../data/ambrociaMenu';

export interface CartLine { menuItem: MenuItem; quantity: number }
export interface CartAction {
  id: string;
  kind: 'add' | 'update' | 'remove';
  item: MenuItem;
  quantity?: number;
  expectedQuantity: number;
}
export function validateCartAction(cart: CartLine[], action: CartAction): string | null {
  if (!action || !action.id || !['add', 'update', 'remove'].includes(action.kind) ||
      !action.item || !/^[a-zA-Z0-9_-]{1,80}$/.test(action.item.id) ||
      typeof action.item.name !== 'string' || !Number.isFinite(action.item.price) || action.item.price < 0) {
    return 'The cart action was invalid.';
  }
  const current = cart.find(line => line.menuItem.id === action.item.id)?.quantity || 0;
  if (current !== action.expectedQuantity) return 'Your cart changed while I was working. Please try again.';
  if (action.kind !== 'add' && !current) return 'That dish is no longer in your cart.';
  if (action.kind !== 'remove' && (!Number.isInteger(action.quantity) || action.quantity! < 1 || action.quantity! > 50 ||
      (action.kind === 'add' && current + action.quantity! > 50))) return 'Quantity must be between 1 and 50.';
  return null;
}
