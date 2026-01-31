import { NextResponse } from "next/server";
import { clearOrders } from "@/lib/orders";

export async function GET(req) {
  const secret = process.env.CRON_SECRET;

  // Vercel Cron invia: Authorization: Bearer <CRON_SECRET>
  const auth = req.headers.get("authorization");
  const expected = secret ? `Bearer ${secret}` : null;

  if (!expected || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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