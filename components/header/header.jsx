"use client";

import Image from "next/image";

import styles from "./header.module.css";

import shopBag from "@/assets/bag.svg";

import { useCartStore } from "@/store/cart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { differenceInDays, differenceInYears } from "date-fns";
import { useEffect, useState } from "react";

export default function Header({ tenantData, tenantTheme }) {
  const { cart } = useCartStore();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  function calculateElapsedTime() {
    const currentDate = new Date();
    const referenceDate = new Date(2001, 8, 24);

    const years = differenceInYears(currentDate, referenceDate);
    const adjustedReferenceDate = new Date(
      referenceDate.getFullYear() + years,
      referenceDate.getMonth(),
      referenceDate.getDate()
    );
    const days = differenceInDays(currentDate, adjustedReferenceDate);

    return (
      <p>
        Aperti da <span>{years} anni</span> e <span>{days} giorni</span>
      </p>
    );
  }

  return (
    <header className={styles.header}>
      <div className="container">
        <nav>
          <div className={styles.headerHeading}>
            <Link href="/">
              <Image
                src={tenantTheme.logoUrl}
                className={styles.headerLogo}
                alt={`Takeaway - ${tenantData.name} Logo`}
                width={100}
                height={100}
                priority
              />
            </Link>
            <span>{tenantData.slogan}</span>
          </div>
          <Link href="/carrello">
            <div className={styles.shopBagWrapper}>
              <Image
                src={shopBag}
                className={styles.shopBag}
                alt="Vai al carrello con i tuoi piatti selezionati"
              />
              {isHydrated && (
                <span className={styles.shopBagCounter}>{cart.length}</span>
              )}
            </div>
          </Link>
        </nav>
      </div>

      {pathname === "/" && (
        <div className={styles.marqueeWrapper}>
          <div className={styles.marquee} aria-live="polite">
            {calculateElapsedTime()}
          </div>
        </div>
      )}
    </header>
  );
}
