"use client";

import Link from "next/link";
import { useState } from "react";

export function DashboardMenu({ menuItems }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

  return (
    <div className="relative">
      <button className="btn btn-primary flex-col" onClick={toggleMenu}>
        <div className="h-0.5 w-5 bg-primary-content"></div>
        <div className="h-0.5 w-5 bg-primary-content"></div>
        <div className="h-0.5 w-5 bg-primary-content"></div>
      </button>
      <div className={`absolute right-0 top-12 bg-white border rounded-md shadow-md py-2 w-48 z-50 transition-all ${menuOpen ? "opacity-100 translate-0" : "opacity-0 translate-x-0.5 -translate-y-0.5 pointer-events-none"}`}>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
