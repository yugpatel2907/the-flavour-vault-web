"use client";

import React from "react";
import { ambrociaMenu, MenuItem } from "@/data/ambrociaMenu";

function inferIsVeg(name: string) {
  const nonVegPattern = /chicken|mutton|egg|fish|prawn|prawns|crab|shrimp|keema|meat|tandoori|kebab|murgh|boneless/i;
  return !nonVegPattern.test(name);
}

function mapCategory(rawCat: string | undefined, name: string, isVeg: boolean) {
  const cat = (rawCat || "").toLowerCase();
  const n = name.toLowerCase();
  if (n.includes("biryani")) return "biryani";
  if (n.includes("bucket")) return "bucket";
  if (cat.includes("chinese") || n.includes("noodle") || n.includes("fried rice") || n.includes("schezwan")) return "chinese";
  if (n.includes("roti") || n.includes("naan") || cat.includes("roti")) return "rotis";
  if (n.includes("kebab") || n.includes("tikka") || cat.includes("kebab")) return isVeg ? "kebabs-veg" : "kebabs-nonveg";
  if (n.includes("tandoori") || n.includes("grill")) return "tandoori";
  if (cat.includes("starter") || n.includes("65") || n.includes("manchuri") || n.includes("fry") || n.includes("pakoda")) return isVeg ? "starters-veg" : "starters-nonveg";
  if (cat.includes("curry") || n.includes("masala") || n.includes("dal") || cat.includes("curries")) return isVeg ? "curries-veg" : "curries-nonveg";
  return "biryani";
}

export function useMenu() {
  const [menu, setMenu] = React.useState<MenuItem[]>(ambrociaMenu);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    async function fetchMenu() {
      setLoading(true);
      const urls = ["/api/menu", "http://localhost:4000/api/menu"];
      for (const u of urls) {
        try {
          const res = await fetch(u, { cache: "no-store" });
          if (!res.ok) throw new Error(`bad status ${res.status}`);
          const data = await res.json();
          if (cancelled) return;
          // normalize
          const normalized: MenuItem[] = data.map((it: any, idx: number) => {
            const name = String(it.name || it.title || `item-${idx}`);
            const isVeg = typeof it.isVeg === 'boolean' ? it.isVeg : inferIsVeg(name);
            const category = mapCategory(it.category, name, isVeg);
            return {
              id: String(it.id ?? it._id ?? idx),
              name,
              category: category as MenuItem['category'],
              price: Number(it.price || 0),
              isVeg,
              description: it.description || "",
            } as MenuItem;
          });
          setMenu(normalized);
          setLoading(false);
          return;
        } catch (e) {
          // try next URL
        }
      }
      setLoading(false);
    }
    fetchMenu();
    return () => {
      cancelled = true;
    };
  }, []);

  return { menu, loading };
}
