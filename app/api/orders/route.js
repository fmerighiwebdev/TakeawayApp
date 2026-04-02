import { after, NextResponse } from "next/server";

import { createOrder } from "@/lib/orders/orders";
import { sendOrderConfirmationEmail } from "@/lib/emails/sendOrderConfirmationEmail";
import {
  mapCreateOrderError,
  validateCreateOrderInput,
} from "@/lib/orders/orderRequest";
import { getTenantId } from "@/lib/tenant/tenantDetails";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const payload = validateCreateOrderInput(await req.json());
    const tenantId = await getTenantId();

    const order = await createOrder(payload, tenantId);

    after(async () => {
      try {
        await sendOrderConfirmationEmail({
          customerName: payload.firstName,
          customerEmail: payload.email,
          pickupTime: payload.pickupTime,
          tenantId,
          orderPublicId: order.publicId,
        });
      } catch (emailError) {
        console.error("Errore nell'invio dell'email di conferma:", emailError);
      }
    });

    return NextResponse.json(
      { orderId: order.id, orderPublicId: order.publicId },
      { status: 200 }
    );
  } catch (error) {
    const normalizedError = mapCreateOrderError(error);

    if (normalizedError.status >= 500) {
      console.error("Errore nella creazione dell'ordine:", error);
    }

    return NextResponse.json(
      { message: normalizedError.message },
      { status: normalizedError.status }
    );
  }
}
