"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

export default function ClearCartOnMount() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, []);

  return null;
}