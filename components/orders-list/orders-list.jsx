import axios from "axios";
import styles from "./orders-list.module.css";

import { useEffect, useState } from "react";
import Loader from "../loader/loader";
import Order from "../order/order";

export default function OrdersList({ status, tenantId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setOrders([]);

      const authToken = localStorage.getItem("auth-token");

      if (!authToken) {
        return;
      }

      try {
        const response = await axios.get(`/api/admin/orders?status=${status}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }

    fetchOrders();
  }, [status]);

  const ordersTotal = orders
    .reduce((acc, order) => acc + parseFloat(order.total_price), 0)
    .toFixed(2);

  const formattedOrdersTotal = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(ordersTotal);

  return (
    <div className={styles.ordersList}>
      {loading ? (
        <Loader />
      ) : (
        <>
          {status === "completed" && orders.length === 0 && (
            <p className={styles.noOrders}>Nessun ordine completato</p>
          )}
          {status === "waiting" && orders.length === 0 && (
            <p className={styles.noOrders}>Nessun ordine in attesa</p>
          )}
          {orders.map((order) => (
            <Order key={order.id} order={order} status={status} numberOfItems={orders.length} />
          ))}
          {status === "completed" && !loading && (
            <div className={styles.ordersTotal}>
              <p>Totale giornaliero</p>
              <p>
                <span>{formattedOrdersTotal}</span>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
