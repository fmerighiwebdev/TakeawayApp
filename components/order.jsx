import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCheck, Clock, HandPlatter } from "lucide-react";

export default function Order({ order, status, numberOfItems }) {
  const formattedTotalPrice = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(order.total_price);

  return (
    <Link href={`/dashboard/${order.id}`}>
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <span className="text-3xl shadow-sm text-white bg-primary block px-2 rounded-sm w-fit">
                #{order.id}
              </span>
              <div>
                <h3 className="text-2xl md:text-3xl text-(--muted-text)">
                  {order.customer_name}
                </h3>
                <p className="text-2xl text-primary font-medium">
                  {formattedTotalPrice}
                </p>
                <p className="text-xl text-(--muted-light-text)">
                  {numberOfItems === 1
                    ? `${numberOfItems} prodotto`
                    : `${numberOfItems} prodotti`}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge
                className={`text-md shadow-sm ${
                  status === "waiting"
                    ? "bg-yellow-400 text-yellow-900"
                    : "bg-green-500 text-white"
                }`}
              >
                {status === "waiting" ? (
                  <HandPlatter className="text-yellow-900" strokeWidth={1.75} />
                ) : (
                  <CheckCheck className="text-white" />
                )}
                {status === "waiting" ? "In Attesa" : "Completato"}
              </Badge>
              <div className="flex items-center gap-2">
                <Clock className="size-6 text-primary" strokeWidth={1.5} />
                <p className="text-2xl text-primary font-medium">
                  {order.pickup_time}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
