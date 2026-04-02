import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function formatCurrency(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function formatDateTime(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Rome",
  }).format(new Date(value));
}

function getCustomerTier(ordersCount) {
  if (ordersCount >= 10) {
    return { label: "Abituale", variant: "default" };
  }

  if (ordersCount >= 3) {
    return { label: "Ricorrente", variant: "secondary" };
  }

  return { label: "Nuovo", variant: "outline" };
}

export default function CustomersTable({ customers }) {
  if (!customers?.length) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Nessun cliente presente al momento.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefono</TableHead>
              <TableHead className="text-center">Ordini</TableHead>
              <TableHead className="text-right">Spesa totale</TableHead>
              <TableHead>Ultimo ordine</TableHead>
              <TableHead>Stato</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.map((customer) => {
              const tier = getCustomerTier(customer.orders_count);

              return (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.full_name || "Cliente"}
                  </TableCell>

                  <TableCell>
                    {customer.normalized_email || "—"}
                  </TableCell>

                  <TableCell>
                    {customer.normalized_phone || "—"}
                  </TableCell>

                  <TableCell className="text-center">
                    {customer.orders_count ?? 0}
                  </TableCell>

                  <TableCell className="text-right">
                    {formatCurrency(customer.total_spent)}
                  </TableCell>

                  <TableCell>
                    {formatDateTime(customer.last_order_at)}
                  </TableCell>

                  <TableCell>
                    <Badge variant={tier.variant}>{tier.label}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}