import Link from "next/link";
import styles from "./order.module.css";

import Image from "next/image";
import { getIcon } from "@/lib/icons";

export default function Order({ order, status, numberOfItems }) {
  const clockIcon = getIcon("clockIcon");

  return (
    <Link href={`/dashboard/${order.id}`} className={styles.order}>
      <div className={styles.orderDetailsWrapper}>
        <div className={styles.orderNumber}>
          <p>#{order.id}</p>
        </div>
        <div className={styles.orderShortInfo}>
          <p className={styles.customerName}>{order.customer_name}</p>
          <div className={styles.pickupTime}>
            <Image src={clockIcon} alt="Orario di ritiro" width={48} height={48} />
            <p>{order.pickup_time}</p>
          </div>
          <div className={styles.orderTotal}>
            <p>
              {numberOfItems === 1
                ? `${numberOfItems} prodotto`
                : `${numberOfItems} prodotti`}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.orderActions}>
        <p
          className={`${styles.orderStatus} ${
            status === "waiting" ? styles.waiting : styles.completed
          }`}
        >
          {status === "waiting" ? "In Attesa" : "Completato"}
        </p>
      </div>
    </Link>
  );
}
