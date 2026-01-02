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
          <div className="flex items-start justify-between relative">
            <div className="flex items-start gap-4 flex-col md:flex-row">
              <span className="text-2xl md:text-3xl shadow-sm text-white bg-primary block px-2 rounded-sm w-fit">
                #{order.id}
              </span>
              <div>
                <div className="items-center gap-2 flex sm:hidden">
                  <Clock className="size-6 text-primary" strokeWidth={1.5} />
                  <p className="text-xl md:text-2xl text-primary font-medium">
                    {order.pickup_time}
                  </p>
                </div>
                <p className="text-2xl md:text-3xl text-(--muted-text)">
                  {order.customer_name}
                </p>
                <p className="text-xl md:text-2xl text-primary font-medium">
                  {formattedTotalPrice}
                </p>
                <p className="text-lg md:text-xl text-(--muted-light-text)">
                  {numberOfItems === 1
                    ? `${numberOfItems} prodotto`
                    : `${numberOfItems} prodotti`}
                </p>
              </div>
            </div>
              <Badge
                className={`text-xs md:text-md absolute top-0 right-0 shadow-sm ${
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
            <div className="flex flex-col items-end gap-2 mt-7">
              <div className="items-center gap-2 hidden sm:flex">
                <Clock className="size-6 text-primary" strokeWidth={1.5} />
                <p className="text-xl md:text-2xl text-primary font-medium">
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
