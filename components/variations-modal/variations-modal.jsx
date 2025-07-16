import Image from "next/image";
import styles from "./variations-modal.module.css";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";

import addToCartIcon from "@/assets/add-to-cart.svg";
import downArrow from "@/assets/down-arrow.svg";
import closeIcon from "@/assets/close-icon.svg";

import Checkbox from "../checkbox/checkbox";
import Radio from "../radio/radio";
import Loader from "../loader/loader";
import useSWR from "swr";

export default function VariationsModal({
  product,
  productId,
  onClose,
  setSuccess,
}) {
  const [selectedDough, setSelectedDough] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedRemovals, setSelectedRemovals] = useState([]);
  const [selectedCookingOption, setSelectedCookingOption] = useState(null);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState(null);
  const [menuOpen, setMenuOpen] = useState({
    doughs: false,
    extras: false,
    removals: false,
    cookingOptions: false,
    spiceLevels: false,
  });

  const { addToCart } = useCartStore();

  // SWR
  const fetcher = (url) =>
    axios.get(url).then((res) => res.data.customizations);

  // Fetch + cache
  const {
    data: customizations,
    error,
    isLoading,
  } = useSWR(`/api/products/customizations/${productId}`, fetcher, {
    revalidateOnFocus: false,
    depupingInterval: 5 * 60 * 1000, // Salva per 5 minuti
  });

  async function handleAddToCart() {
    const variationsCount =
      (selectedDough ? 1 : 0) +
      selectedExtras.length +
      selectedRemovals.length +
      (selectedCookingOption ? 1 : 0) +
      (selectedSpiceLevel ? 1 : 0);

    addToCart(
      product,
      selectedDough,
      selectedExtras,
      selectedRemovals,
      selectedCookingOption,
      selectedSpiceLevel
    );

    setSuccess({ productName: product.name, variations: variationsCount });
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
    onClose();
  }

  function handleExtrasChange(event, extraItem) {
    if (event.target.checked) {
      setSelectedExtras((prev) => [...prev, extraItem]);
    } else {
      setSelectedExtras((prev) =>
        prev.filter((extra) => extra?.name !== extraItem.name)
      );
    }
  }

  function handleRemovalsChange(event, removalItem) {
    if (event.target.checked) {
      setSelectedRemovals((prev) => [...prev, removalItem]);
    } else {
      setSelectedRemovals((prev) =>
        prev.filter((removal) => removal?.name !== removalItem.name)
      );
    }
  }

  function convertToCurrency(value) {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
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
          className={styles.variationsModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-variazioni"
        >
          <div className={styles.variationsModalHeading}>
            <h3 id="popup-variazioni">
              Seleziona le variazioni per <span>{product.name}</span>
            </h3>
            <button onClick={onClose} aria-label="Chiudi pannello variazioni">
              <Image
                src={closeIcon}
                width={25}
                height={25}
                alt="Chiudi pannello variazioni"
              />
            </button>
          </div>
          {isLoading && <Loader />}
          {error && (
            <p className="errorBanner" role="alert">
              {error}
            </p>
          )}
          {customizations && (
            <div className={styles.variationsModalContent}>
              {customizations.doughs?.some((dough) => dough.id) && (
                <div className={styles.variationDoughs}>
                  <div
                    className={styles.variationHeading}
                    onClick={() =>
                      setMenuOpen((prev) => ({
                        ...prev,
                        doughs: !prev.doughs,
                      }))
                    }
                  >
                    <h4>Impasto</h4>
                    <Image
                      src={downArrow}
                      width={15}
                      height={15}
                      alt="Apri pannello impasti"
                      style={{
                        transform: menuOpen.doughs
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </div>
                  {menuOpen.doughs && (
                    <ul>
                      {customizations.doughs.map((dough, index) => {
                        return (
                          <li key={index}>
                            <Radio
                              label={`${dough.name} +${convertToCurrency(
                                dough.price
                              )}`}
                              name="dough"
                              id={dough.name}
                              value={dough.name}
                              checked={selectedDough?.name === dough.name}
                              onChange={() => setSelectedDough(dough)}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
              {customizations.extras?.some((extra) => extra.id) && (
                <div className={styles.variationExtras}>
                  <div
                    className={styles.variationHeading}
                    onClick={() =>
                      setMenuOpen((prev) => ({
                        ...prev,
                        extras: !prev.extras,
                      }))
                    }
                  >
                    <h4>Extra</h4>
                    <Image
                      src={downArrow}
                      width={15}
                      height={15}
                      alt="Apri pannello impasti"
                      style={{
                        transform: menuOpen.extras
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </div>
                  {menuOpen.extras && (
                    <ul>
                      {customizations.extras.map((extra, index) => (
                        <li key={index}>
                          <Checkbox
                            label={extra.name}
                            id={`extra-${extra.name}`}
                            checked={selectedExtras.some(
                              (e) => e.name === extra.name
                            )}
                            onChange={(event) =>
                              handleExtrasChange(event, extra)
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {customizations.removals?.some((removal) => removal.id) && (
                <div className={styles.variationExtras}>
                  <div
                    className={styles.variationHeading}
                    onClick={() =>
                      setMenuOpen((prev) => ({
                        ...prev,
                        removals: !prev.removals,
                      }))
                    }
                  >
                    <h4>Rimozioni</h4>
                    <Image
                      src={downArrow}
                      width={15}
                      height={15}
                      alt="Apri pannello impasti"
                      style={{
                        transform: menuOpen.removals
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </div>
                  {menuOpen.removals && (
                    <ul>
                      {customizations.removals.map((removal, index) => (
                        <li key={index}>
                          <Checkbox
                            label={`${removal.name}`}
                            id={`removal-${removal.name}`}
                            checked={selectedRemovals.some(
                              (e) => e.name === removal.name
                            )}
                            onChange={(event) =>
                              handleRemovalsChange(event, removal)
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {customizations.cookingoptions?.some((option) => option.id) && (
                <div className={styles.variationExtras}>
                  <div
                    className={styles.variationHeading}
                    onClick={() =>
                      setMenuOpen((prev) => ({
                        ...prev,
                        cookingOptions: !prev.cookingOptions,
                      }))
                    }
                  >
                    <h4>Opzioni di cottura</h4>
                    <Image
                      src={downArrow}
                      width={15}
                      height={15}
                      alt="Apri pannello impasti"
                      style={{
                        transform: menuOpen.cookingOptions
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </div>
                  {menuOpen.cookingOptions && (
                    <ul>
                      {customizations.cookingoptions.map((option, index) => (
                        <li key={index}>
                          <Radio
                            label={option.label}
                            name="cookingOption"
                            id={`cookingOption-${option.label}`}
                            value={option.label}
                            checked={
                              selectedCookingOption?.label === option.label
                            }
                            onChange={() => setSelectedCookingOption(option)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {customizations.spicelevels?.some((option) => option.id) && (
                <div className={styles.variationExtras}>
                  <div
                    className={styles.variationHeading}
                    onClick={() =>
                      setMenuOpen((prev) => ({
                        ...prev,
                        spiceLevels: !prev.spiceLevels,
                      }))
                    }
                  >
                    <h4>Livello di piccantezza</h4>
                    <Image
                      src={downArrow}
                      width={15}
                      height={15}
                      alt="Apri pannello impasti"
                      style={{
                        transform: menuOpen.spiceLevels
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </div>
                  {menuOpen.spiceLevels && (
                    <ul>
                      {customizations.spicelevels.map((option, index) => (
                        <li key={index}>
                          <Radio
                            label={option.label}
                            name="spiceLevel"
                            id={`spiceLevel-${option.label}`}
                            value={option.label}
                            checked={selectedSpiceLevel?.label === option.label}
                            onChange={() => setSelectedSpiceLevel(option)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
          <div className={styles.addToCartFixed}>
            <button onClick={handleAddToCart} className={styles.addToCartBtn}>
              <Image
                src={addToCartIcon}
                alt="Aggiungi al carrello"
                width={40}
                height={40}
              />
            </button>
          </div>
        </motion.dialog>
      </AnimatePresence>
    </div>,
    document.body
  );
}
