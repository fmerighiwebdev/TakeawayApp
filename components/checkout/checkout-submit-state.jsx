"use client";

import { AnimatePresence, motion } from "motion/react";

import { Spinner } from "@/components/ui/spinner";

export default function CheckoutSubmitState({ loading }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5">
      <AnimatePresence mode="wait" initial={false}>
        {!loading ? (
          <motion.button
            key="submit-button"
            type="submit"
            className="btn btn-primary w-fit text-lg"
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            Conferma ordine
          </motion.button>
        ) : (
          <motion.div
            key="submit-spinner"
            initial={{ opacity: 0, scale: 0.8, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <Spinner className="size-8 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-xs text-neutral-400">con obbligo di pagamento in cassa</span>
    </div>
  );
}
