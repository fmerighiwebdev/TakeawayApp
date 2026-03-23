"use client";

import { useEffect, useRef, useState } from "react";

export default function ProductDescription({ description }) {
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el || !description) return;

    const checkOverflow = () => {
      setIsTruncated(el.scrollHeight > el.clientHeight + 1);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);

    window.addEventListener("resize", checkOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkOverflow);
    };
  }, [description]);

  if (!description) return null;

  return (
    <div
      className="group relative"
      tabIndex={isTruncated ? 0 : -1}
      aria-label={isTruncated ? description : undefined}
    >
      <p
        ref={textRef}
        className="md:line-clamp-3 text-sm leading-6 text-(--muted-light-text)"
      >
        <em>{description}</em>
      </p>

      {isTruncated && (
        <div className="pointer-events-none invisible absolute -left-8 top-full z-40 mt-2 w-max max-w-xs -translate-y-1 rounded-md border bg-white px-3 py-2 text-sm leading-5 text-slate-700 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:visible group-focus-visible:translate-y-0 group-focus-visible:opacity-100 dark:bg-slate-900 dark:text-slate-100">
          <em>{description}</em>
        </div>
      )}
    </div>
  );
}