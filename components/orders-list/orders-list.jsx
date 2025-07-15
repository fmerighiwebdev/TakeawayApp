import styles from "./orders-list.module.css";
import Order from "../order/order";

export default function OrdersList({ orders, status }) {
  const ordersTotal = orders
    .reduce((acc, order) => acc + parseFloat(order.total_price), 0)
    .toFixed(2);

  const formattedOrdersTotal = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(ordersTotal);

  const waitingOrders = orders.filter((order) => order.status === "In Attesa");
  const completedOrders = orders.filter(
    (order) => order.status === "Completato"
  );

  return (
    <div className={styles.ordersList}>
      {status === "completed" && completedOrders.length === 0 && (
        <p className={styles.noOrders}>Nessun ordine completato</p>
      )}
      {status === "waiting" && waitingOrders.length === 0 && (
        <p className={styles.noOrders}>Nessun ordine in attesa</p>
      )}
      {(status === "waiting" ? waitingOrders : completedOrders).map((order) => (
        <Order
          key={order.id}
          order={order}
          status={status}
          numberOfItems={order.order_items.length}
        />
      ))}
      {status === "completed" && completedOrders.length > 0 && (
        <div className={styles.ordersTotal}>
          <p>Totale giornaliero</p>
          <p>
            <span>{formattedOrdersTotal}</span>
          </p>
        </div>
      )}
    </div>
  );

  /* return (
    <div className={styles.ordersList}>
      <>
        {status === "completed" && orders.length === 0 && (
          <p className={styles.noOrders}>Nessun ordine completato</p>
        )}
        {status === "waiting" && orders.length === 0 && (
          <p className={styles.noOrders}>Nessun ordine in attesa</p>
        )}
        {orders.map((order) => (
          <Order
            key={order.id}
            order={order}
            status={status}
            numberOfItems={orders.length}
          />
        ))}
        {status === "completed" && (
          <div className={styles.ordersTotal}>
            <p>Totale giornaliero</p>
            <p>
              <span>{formattedOrdersTotal}</span>
            </p>
          </div>
        )}
      </>
    </div>
  ); */
}
