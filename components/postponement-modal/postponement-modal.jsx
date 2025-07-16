import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import styles from "./postponement.module.css";
import Input from "../input/input";
import { useRef } from "react";

export default function PostponementModal({
  setShowPostponement,
  orderId,
  setSuccess,
}) {
  const postponementTimeRef = useRef(null);

  async function handlePostponeTime() {
    const postponementTime = postponementTimeRef.current.value;

    try {
      await axios.patch(
        `/api/admin/orders/${orderId}`,
        { postponementTime: postponementTime },
      );
      setSuccess(`Orario di ritiro aggiornato a ${postponementTime}`);
      window.location.reload();
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
          className={styles.postponementModal}
        >
          <div className={styles.modalContent}>
            <h3>Ordine in ritardo?</h3>
            <p>
              Aggiorna l&apos;orario di ritiro dell&apos;ordine. <br />
              Il cliente verrà avvisato automaticamente non appena imposti il
              nuovo orario.
            </p>
            <Input
              type="time"
              id="postponementTime"
              name="postponementTime"
              ref={postponementTimeRef}
            />
            <div className={styles.modalActions}>
              <button
                className={styles.confirmButton}
                onClick={() => {
                  handlePostponeTime();
                  setShowPostponement(false);
                }}
              >
                Completa
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowPostponement(false)}
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
