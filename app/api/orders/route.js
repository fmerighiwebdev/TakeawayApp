import { NextResponse } from "next/server";

import { createOrder } from "@/lib/orders";
import { sendOrderConfirmationEmail } from "@/lib/emails/sendOrderConfirmationEmail";
import { getTenantId } from "@/lib/tenantDetails";

export async function POST(req, res) {
  const { name, surname, time, phone, email, items } = await req.json();

  if (!name || !surname || !time || !phone || !email || !items) {
    return NextResponse.json({ message: "Dati mancanti" }, { status: 400 });
  }

  if (!/^\d{10,15}$/.test(phone)) {
    return NextResponse.json(
      { message: "Inserisci un numero di telefono valido" },
      { status: 400 }
    );
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { message: "Inserisci un indirizzo email valido" },
      { status: 400 }
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { message: "L'ordine deve contenere almeno un elemento" },
      { status: 400 }
    );
  }

  try {
    const total_price = items
      .reduce(
        (total, item) =>
          total +
          item.price * item.quantity +
          (item.selectedDough?.price || 0) * item.quantity +
          item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0) *
            item.quantity,
        0
      )
      .toFixed(2);
    const full_name = `${name} ${surname}`;
    const orderData = {
      full_name,
      time,
      phone,
      total_price,
      email,
      items,
    };

    const tenantId = await getTenantId();
    console.log("Ordine in arrivo:", orderData);
    const orderIds = await createOrder(orderData, tenantId);

    try {
      await sendOrderConfirmationEmail({
        customerName: name,
        customerEmail: email,
        orderItems: items,
        total: total_price,
        pickupTime: time,
        orderId: orderIds.id,
        orderPublicId: orderIds.publicId,
      });
    } catch (emailError) {
      console.error("Errore nell'invio dell'email:", emailError);
      return NextResponse.json(
        { message: "Ordine creato, ma errore nell'invio dell'email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { orderId: orderIds.id, orderPublicId: orderIds.publicId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Errore nella creazione dell'ordine:", error);
    return NextResponse.json(
      { message: "Errore nella creazione dell'ordine. Riprova." },
      { status: 500 }
    );
  }
}
