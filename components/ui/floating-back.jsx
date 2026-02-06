"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingBack({ href }) {
  const [isVisible, setIsVisible] = useState(false);

  
  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 200);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-12 left-0 w-full transition-all duration-300 ${
        isVisible
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="container">
        <Link
          href={href}
          className="card bg-(--white) bg-opacity-90 shadow-sm rounded-full h-12 w-12 flex items-center justify-center"
        >
          <div className="relative w-fit h-fit">
            <ArrowLeft size={32} color="var(--color-primary)" strokeWidth={1.5} />
          </div>
        </Link>
      </div>
    </div>
  );
}
