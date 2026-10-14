const { menuCatalog } = require('../data/menu.ts');

async function searchMenu(filters = {}) {
  return menuCatalog.filter(item =>
    Number.isFinite(item.price) && item.price >= 0 &&
    (filters.itemId === undefined || item.id === filters.itemId) &&
    (!filters.query || `${item.name} ${item.category} ${item.description || ''}`.toLowerCase().includes(filters.query.toLowerCase())) &&
    (filters.isVeg === undefined || item.isVeg === filters.isVeg) &&
    (filters.minPrice === undefined || item.price >= filters.minPrice) &&
    (filters.maxPrice === undefined || item.price <= filters.maxPrice) &&
    (!filters.category || item.category.toLowerCase() === filters.category.toLowerCase()) &&
    (filters.minSpicyLevel === undefined || item.spicyLevel >= filters.minSpicyLevel) &&
    (filters.maxSpicyLevel === undefined || item.spicyLevel <= filters.maxSpicyLevel));
}

async function getMenuItem(itemId) {
  return (await searchMenu({ itemId }))[0] || null;
}

module.exports = { searchMenu, getMenuItem };
