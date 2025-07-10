import { NextResponse } from "next/server";
import { clearOrders } from "@/lib/orders";

export async function GET(req) {
  // SOLO CRON JOB può accedere a questo endpoint
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Accesso non autorizzato" }, { status: 401 });
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