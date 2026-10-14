import { ambrociaMenu, type MenuItem } from './ambrociaMenu.ts';
import { punjabiSabjiDishes } from './punjabiSabjiData.ts';

// One catalog for the menu UI, cart, API and AI. Reuse the existing purchasable
// dishes, including the Punjabi carousel; do not maintain an AI-only copy.
export const menuCatalog: MenuItem[] = [
  ...ambrociaMenu,
  ...punjabiSabjiDishes.map(({ id, name, price, isVeg, spicyLevel, description }) => ({
    id, name, price, isVeg, spicyLevel, description,
    category: 'curries-veg' as const,
  })),
];
