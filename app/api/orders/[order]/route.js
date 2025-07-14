import { NextResponse } from "next/server";

import { getOrderByPublicIdWithDetails } from "@/lib/orders";
import { getTenantId } from "@/lib/tenantDetails";

export async function GET(req, { params }) {
  const { order: orderPublicId } = await params;
  const tenantId = getTenantId();

  try {
    const orderDetails = await getOrderByPublicIdWithDetails(tenantId, orderPublicId);
    console.log("Dettagli ordine recuperati:", orderDetails);
    return NextResponse.json({ orderDetails: orderDetails }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
  }
}
