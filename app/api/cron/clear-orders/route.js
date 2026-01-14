import { NextResponse } from "next/server";
import { clearOrders } from "@/lib/orders";

export async function GET(req) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
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