"use client";

import { menuCatalog } from "@/data/menu";

// The bundled catalog is also the server/AI source of truth. Menu and cart work
// even when the optional AI provider is unavailable.
export function useMenu() {
  return { menu: menuCatalog, loading: false, authoritative: true };
}
