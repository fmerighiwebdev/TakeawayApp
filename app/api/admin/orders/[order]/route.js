import { NextResponse } from "next/server";

import {
  getCustomerByOrderId,
  getOrderByIdWithDetails,
  updateOrderStatus,
  updatePickUpTime,
} from "@/lib/orders";

import { sendOrderPostponementEmail } from "@/lib/emails/sendOrderPostponementEmail";

import jwt from "jsonwebtoken";

function verifyToken(token) {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

export async function GET(req, { params }) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Non sei autenticato." },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  if (!verifyToken(token)) {
    return NextResponse.json(
      { error: "Non sei autenticato." },
      { status: 401 }
    );
  }

  const { order: orderId } = await params;

  const orderDetails = await getOrderByIdWithDetails(orderId);

  return NextResponse.json({ orderDetails: orderDetails }, { status: 200 });
}

export async function PATCH(req, { params }) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Non sei autenticato." },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  if (!verifyToken(token)) {
    return NextResponse.json(
      { error: "Non sei autenticato." },
      { status: 401 }
    );
  }

  const { order: orderId } = await params;
  const body = await req.json();

  if (body.status) {
    const { status } = body;
    if (status !== "In Attesa" && status !== "Completato") {
      return NextResponse.json({ error: "Stato non valido" }, { status: 400 });
    }

    await updateOrderStatus(orderId, status);

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
      await updatePickUpTime(orderId, postponementTime);

      try {
        const customerData = await getCustomerByOrderId(orderId);
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
