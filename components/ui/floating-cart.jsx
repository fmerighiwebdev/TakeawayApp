"use client";

import { useCartStore } from "@/store/cart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FloatingCart() {
  const { cart } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className="fixed bottom-12 right-0 w-full z-999">
      <div className="container flex justify-end">
        <Link href="/carrello" className="card bg-primary bg-opacity-90 shadow-sm rounded-full h-24 w-24 flex items-center justify-center">
          <div className="relative w-fit h-fit">
            <ShoppingBag
              size={48}
              color="var(--color-primary-content)"
              strokeWidth={1.5}
            />
            {isHydrated && (
              <div className="absolute top-0 right-0 w-5 h-5 bg-(--white) text-(--muted-text) flex items-center justify-center rounded-full shadow-sm">
                <span className="text-xs font-bold">{cart.length}</span>
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
