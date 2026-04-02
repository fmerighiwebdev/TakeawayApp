"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { useCartStore } from "@/store/cart";

export default function FloatingCart() {
  const { cart, hydrated } = useCartStore();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-40 transition-[bottom] duration-300 ease-out"
      style={{
        bottom:
          "calc(env(safe-area-inset-bottom, 0px) + var(--install-prompt-offset, 0px) + 16px)",
      }}
    >
      <div className="pointer-events-none container flex justify-end px-4">
        <Link
          href="/carrello"
          className="pointer-events-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-md md:h-24 md:w-24"
        >
          <div className="relative h-fit w-fit">
            <ShoppingBag
              color="var(--color-primary-content)"
              className="h-11 w-11 md:h-12 md:w-12"
              strokeWidth={1.5}
            />
            {hydrated && (
              <div className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                <span className="text-xs font-bold">{cart.length}</span>
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
