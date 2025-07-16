import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import styles from "./confirmation-modal.module.css";
import { useRouter } from "next/navigation";

export default function ConfirmationModal({ setShowConfirmation, orderId }) {
  const router = useRouter();

  async function handleCompleteOrder() {
    try {
      const response = await axios.patch(`/api/admin/orders/${orderId}`, {
        newStatus: "Completato",
      });

      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  return createPortal(
    <div className={styles.modalOverlay}>
      <AnimatePresence>
        <motion.dialog
          open
          initial={{ opacity: 0, scale: 0.85, x: "-50%", y: "-50%" }}
          animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
          exit={{ opacity: 0, scale: 0.85, x: "-50%", y: "-50%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={styles.confirmationModal}
        >
          <div className={styles.modalContent}>
            <h3>
              Completamento ordine <span>n°{orderId}</span>
            </h3>
            <div>
              <p>Sei sicuro di voler completare l&apos;ordine?</p>
              <p className={styles.warningText}>
                Questa azione non può essere annullata.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.confirmButton}
                onClick={() => {
                  handleCompleteOrder();
                  setShowConfirmation(false);
                }}
              >
                Completa
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowConfirmation(false)}
              >
                Annulla
              </button>
            </div>
          </div>
        </motion.dialog>
      </AnimatePresence>
    </div>,
    document.body
  );
}
