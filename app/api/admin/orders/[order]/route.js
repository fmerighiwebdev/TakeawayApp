import { NextResponse } from "next/server";

import {
  getCustomerByOrderId,
  getOrderCustomerDetails,
  updateOrderStatus,
  updatePickUpTime,
} from "@/lib/orders";

import { sendOrderPostponementEmail } from "@/lib/emails/sendOrderPostponementEmail";

import jwt from "jsonwebtoken";
import { getTenantId } from "@/lib/tenantDetails";
import { cookies } from "next/headers";

function verifyToken(token) {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

export async function PATCH(req, { params }) {
  const tenantId = getTenantId();
  const cookieStore = cookies();
  const cookieKey = `auth-token-${tenantId}`;
  const token = cookieStore.get(cookieKey)?.value;

  if (!verifyToken(token)) {
    return NextResponse.json(
      { error: "Non sei autenticato." },
      { status: 401 }
    );
  }

  const { order: orderId } = await params;
  const body = await req.json();

  if (body.newStatus) {
    const { newStatus } = body;
    if (newStatus !== "In Attesa" && newStatus !== "Completato") {
      return NextResponse.json({ error: "Stato non valido" }, { status: 400 });
    }

    await updateOrderStatus(orderId, newStatus, tenantId);

    return NextResponse.json(
      { message: "Stato ordine aggiornato" },
      { status: 200 }
    );
  }

  if (body.postponementTime) {
    const { postponementTime } = body;

    if (!postponementTime) {
      return NextResponse.json(
        { error: "Orario di ritiro non valido" },
        { status: 400 }
      );
    }

    try {
      await updatePickUpTime(orderId, postponementTime, tenantId);

      try {
        const customerData = await getOrderCustomerDetails(tenantId, orderId);
        const customerName = customerData.customer_name;
        const customerEmail = customerData.customer_email;

        await sendOrderPostponementEmail({
          customerName,
          customerEmail,
          postponementTime,
          orderId,
        });
      } catch (error) {
        console.error(
          "Orario di ritiro aggiornato, errore durante l'invio dell'email:",
          error
        );
        return NextResponse.json(
          {
            error:
              "Orario di ritiro aggiornato, errore durante l'invio dell'email di avviso",
          },
          { status: 500 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Errore durante l'aggiornamento dell'orario di ritiro" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Orario di ritiro aggiornato" },
      { status: 200 }
    );
  }

  return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
}
