"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingBack({ href }) {
  const [isVisible, setIsVisible] = useState(false);

  function handleScroll() {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div
      className={`fixed top-12 left-0 w-full ${
        isVisible
          ? "opacity-100 scale-100 pointer-events-auto transition-all duration-300"
          : "opacity-0 scale-95 pointer-events-none transition-all duration-300"
      }`}
    >
      <div className="container">
        <Link
          href={href}
          className="card bg-(--white) bg-opacity-90 shadow-sm rounded-full h-12 w-12 flex items-center justify-center"
        >
          <div className="relative w-fit h-fit">
            <ArrowLeft size={32} color="var(--muted-text)" strokeWidth={1.5} />
          </div>
        </Link>
      </div>
    </div>
  );
}
