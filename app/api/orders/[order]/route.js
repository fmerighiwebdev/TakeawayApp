import { NextResponse } from "next/server";

import { getOrderById } from "@/lib/orders";

export async function GET(req, { params }) {
  const { order: orderId } = await params;

  try {
    const orderDetails = await getOrderById(orderId);
    return NextResponse.json({ orderDetails: orderDetails }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
  }
}
