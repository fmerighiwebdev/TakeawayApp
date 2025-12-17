import Order from "./order";

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

  const activeOrders = status === "waiting" ? waitingOrders : completedOrders;

  return (
    <div className="flex flex-col gap-4">
      {status === "completed" && completedOrders.length === 0 && (
        <p className="text-center text-lg text-(--muted-text)">
          Nessun ordine completato
        </p>
      )}
      {status === "waiting" && waitingOrders.length === 0 && (
        <p className="text-center text-lg text-(--muted-text)">
          Nessun ordine in attesa
        </p>
      )}
      {activeOrders.map((order) => (
        <Order
          key={order.id}
          order={order}
          status={status}
          numberOfItems={order.order_items.length}
        />
      ))}
      {status === "completed" /* && completedOrders.length > 0 */ && (
        <div className="absolute bottom-15 left-1/2 -translate-x-1/2 w-full max-w-3xl border rounded-md bg-white py-4 px-6">
          <p className="text-xl text-center uppercase font-medium text-(--muted-text)">
            Totale giornaliero
          </p>
          <p className="text-3xl text-center font-medium text-primary">
            {formattedOrdersTotal}
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
