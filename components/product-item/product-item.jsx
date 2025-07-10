import { useCartStore } from "@/store/cart";
import styles from "./product-item.module.css";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import checkBoldIcon from "@/assets/check-bold.svg";
import addToCartIcon from "@/assets/add-to-cart.svg";
import pepperIcon from "@/assets/pepper-icon.svg";
import Image from "next/image";
import VariationsModal from "../variations-modal/variations-modal";

export default function ProductItem({ product }) {
  const { addToCart } = useCartStore();

  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedPrice = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);

  function productDescriptionRenderer(currentProduct) {
    if (!currentProduct.description) {
      return null;
    }

    const productsDescriptionList = [51, 52, 53, 54];

    const shouldFormatAsList = productsDescriptionList.includes(currentProduct.id);

    if (shouldFormatAsList) {
      const splitterRegex = /\s*,\s*(?![^()]*\))/g;
      const descriptionItems = currentProduct.description
        .split(splitterRegex)
        .map(item => item.trim())
        .filter(item => item.length > 0);

      if (descriptionItems.length === 0) {
        return (
          <p className={styles.productGridItemDescription}>
            {currentProduct.description}
          </p>
        );
      }

      return (
        <ul className={styles.descriptionList}>
          {descriptionItems.map((item, index) => {
            const openParenIndex = item.indexOf('(');
            let mainName = '';
            let subDescription = '';

            if (openParenIndex > -1 && openParenIndex > 0) {
              mainName = item.substring(0, openParenIndex).trim();
              subDescription = item.substring(openParenIndex).trim();
            } else {
              mainName = item;
            }

            return (
              <li key={`${currentProduct.id}-desc-${index}`}>
                <strong>{mainName}</strong>
                {subDescription && ` ${subDescription}`}
              </li>
            );
          })}
        </ul>
      );
    } else {
      return (
        <p className={styles.productGridItemDescription}>
          {currentProduct.description}
        </p>
      );
    }
  }

  return (
    <>
      {isModalOpen && (
        <VariationsModal
          product={product}
          productId={product.id}
          onClose={() => setIsModalOpen(false)}
          setSuccess={setSuccess}
        />
      )}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.75, x: "-50%" }}
            transition={{ duration: 0.3 }}
            className="successBanner"
            role="status"
            aria-live="polite"
          >
            <p>
              <span>
                {success.productName}{" "}
                {success.variations > 0 && ` +${success.variations} variazioni`}
              </span>{" "}
              aggiunto al carrello
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <li className={styles.productGridItem}>
        <div className={styles.productGridItemHeading}>
          <div className={styles.productTitle}>
            <h3>{product.name}{" "}
              {product.spice_level > 0 && (
                <span className={styles.spiceLevel} title="Livello di piccantezza">
                  {Array.from({ length: product.spice_level }).map((_, index) => (
                    <Image
                      key={index}
                      src={pepperIcon}
                      alt=""
                      aria-hidden="true"
                      width={16}
                      height={16}
                      className={styles.spiceIcon}
                    />
                  ))}
                </span>
              )}
            </h3>
          </div>
          <p>{formattedPrice}</p>
        </div>
        {productDescriptionRenderer(product)}
        <div className={styles.productGridItemActions}>
          {product.has_customizations && (
            <button
              className={styles.modalBtn}
              onClick={() => setIsModalOpen(true)}
            >
              Personalizzazioni
            </button>
          )}
          <button
            onClick={() => {
              addToCart(product);
              setSuccess({ productName: product.name, variations: 0 });
              setTimeout(() => {
                setSuccess(null);
              }, 3000);
            }}
            className={styles.addToCartBtn}
            aria-label="Aggiungi al carrello"
          >
            {success ? (
              <Image
                src={checkBoldIcon}
                alt=""
                aria-hidden="true"
                width={20}
                height={20}
              />
            ) : (
              <div>
                <Image
                  src={addToCartIcon}
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                />
              </div>
            )}
          </button>
        </div>
      </li>
    </>
  );
}
