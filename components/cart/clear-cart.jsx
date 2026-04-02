"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

export default function ClearCartOnMount() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}