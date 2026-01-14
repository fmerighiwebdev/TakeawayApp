"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function AdminTemplate({ children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={typeof window !== "undefined" ? window.location.pathname : "public"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="min-h-screen flex flex-col bg-white"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}