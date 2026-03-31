import { NextResponse } from "next/server";

import { createOrder } from "@/lib/orders";
import {
  findOrCreateCustomerFromOrder,
  updateCustomerOrderStats,
} from "@/lib/customers";
import {
  validateDiscountCodeForCustomer,
  registerDiscountCodeRedemption,
} from "@/lib/discountCodes";
import { sendOrderConfirmationEmail } from "@/lib/emails/sendOrderConfirmationEmail";
import { getTenantId } from "@/lib/tenantDetails";

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export async function POST(req) {
  const {
    name,
    surname,
    time,
    phone,
    email,
    notes,
    items,
    discount_code,
  } = await req.json();

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
    const tenantId = await getTenantId();

    // totale carrello
    const totalNumber = items.reduce((total, item) => {
      const base = item.price * item.quantity;
      const dough = (item.selectedDough?.price || 0) * item.quantity;
      const extras =
        item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0) *
        item.quantity;

      return total + base + dough + extras;
    }, 0);

    const total_price = round2(totalNumber);
    const full_name = `${name} ${surname}`;

    const customerId = await findOrCreateCustomerFromOrder({
      tenantId,
      firstName: name,
      lastName: surname,
      email,
      phone,
      privacyConsent: true,
    });

    // sconto
    let appliedDiscountCode = null;
    let appliedDiscountId = null;
    let percent_off = null;
    let discounted_price = null;

    if (discount_code) {
      const couponCheck = await validateDiscountCodeForCustomer({
        tenantId,
        customerId,
        code: discount_code,
      });

      if (couponCheck.reason === "already_used") {
        return NextResponse.json(
          { message: "Hai già utilizzato questo codice sconto." },
          { status: 400 }
        );
      }

      if (couponCheck.valid && couponCheck.discount) {
        appliedDiscountId = couponCheck.discount.id;
        appliedDiscountCode = couponCheck.discount.code;
        percent_off = couponCheck.discount.percent_off;

        const multiplier = 1 - percent_off / 100;
        discounted_price = round2(total_price * multiplier);
      }
    }

    const effectiveTotal = discounted_price ?? total_price;

    const orderData = {
      full_name,
      time,
      phone,
      total_price,
      email,
      notes,
      items,
      customer_id: customerId,
      discount_code: appliedDiscountCode,
      percent_off,
      discounted_price,
    };

    const orderIds = await createOrder(orderData, tenantId);

    if (appliedDiscountId) {
      await registerDiscountCodeRedemption({
        tenantId,
        discountCodeId: appliedDiscountId,
        customerId,
        orderId: orderIds.id,
      });
    }

    await updateCustomerOrderStats({
      customerId,
      orderTotal: effectiveTotal,
    });

    try {
      await sendOrderConfirmationEmail({
        customerName: name,
        customerEmail: email,
        pickupTime: time,
        tenantId,
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