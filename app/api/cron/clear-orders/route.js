import { NextResponse } from "next/server";
import { clearOrders } from "@/lib/orders";

export async function GET(req) {
  try {
    await clearOrders();
    return NextResponse.json(
      { message: "Ordini cancellati con successo" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Errore nella cancellazione degli ordini" },
      { status: 500 }
    );
  }
}