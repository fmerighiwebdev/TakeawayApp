import { NextResponse } from "next/server";
import { buildOrdersCsv } from "@/lib/orders/exportOrders";
import { getCurrentMonthDateRange } from "@/lib/orders/orderDateRanges";
import { getPastOrdersByTenantIdWithDetails } from "@/lib/orders/orders";
import { getTenantId } from "@/lib/tenant/tenantDetails";

export const runtime = "nodejs";

function getCsvFileName() {
  const now = new Date();

  const year = new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    year: "numeric",
  }).format(now);

  const month = new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    month: "2-digit",
  }).format(now);

  return `ordini-${year}-${month}.csv`;
}

export async function GET() {
  try {
    const tenantId = await getTenantId();
    const { startAt, endAt } = getCurrentMonthDateRange();
    const orders = await getPastOrdersByTenantIdWithDetails(tenantId, {
      startAt,
      endAt,
    });

    const csv = buildOrdersCsv(orders);
    const fileName = getCsvFileName();

    return new NextResponse(`\uFEFF${csv}`, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Errore export CSV ordini:", error);

    return NextResponse.json(
      { error: "Errore durante l'esportazione del CSV." },
      { status: 500 }
    );
  }
}
