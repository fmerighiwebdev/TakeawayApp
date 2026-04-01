import { NextResponse } from "next/server";

import { getTenantId } from "@/lib/tenantDetails";
import { findCustomerByIdentity } from "@/lib/customers";
import {
  getDiscountCodeByCode,
  validateDiscountCodeForCustomer,
} from "@/lib/discountCodes";
import { normalizeDiscountCode } from "@/lib/orderRequest";

export async function POST(req) {
  try {
    const { email, phone, code } = await req.json();

    const normalizedCode = normalizeDiscountCode(code);

    if (!normalizedCode) {
      return NextResponse.json(
        { valid: false, message: "Inserisci un codice sconto." },
        { status: 400 }
      );
    }

    if (!email || !phone) {
      return NextResponse.json(
        {
          valid: false,
          message: "Inserisci email e telefono per verificare il codice sconto.",
        },
        { status: 400 }
      );
    }

    const tenantId = await getTenantId();

    const discount = await getDiscountCodeByCode({
      tenantId,
      code: normalizedCode,
    });

    if (!discount) {
      return NextResponse.json(
        { valid: false, message: "Codice sconto non valido." },
        { status: 400 }
      );
    }

    const customer = await findCustomerByIdentity({
      tenantId,
      email,
      phone,
    });

    // Se il customer non esiste ancora, il coupon è applicabile
    if (!customer) {
      return NextResponse.json({
        valid: true,
        code: discount.code,
        percent_off: discount.percent_off,
      });
    }

    const couponCheck = await validateDiscountCodeForCustomer({
      tenantId,
      customerId: customer.id,
      code: normalizedCode,
    });

    if (couponCheck.reason === "already_used") {
      return NextResponse.json(
        {
          valid: false,
          message: "Hai già utilizzato questo codice sconto.",
        },
        { status: 400 }
      );
    }

    if (!couponCheck.valid) {
      return NextResponse.json(
        {
          valid: false,
          message: "Codice sconto non valido.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      code: couponCheck.discount.code,
      percent_off: couponCheck.discount.percent_off,
    });
  } catch (error) {
    console.error("Errore validate discount:", error);

    return NextResponse.json(
      { valid: false, message: "Errore durante la verifica del codice sconto." },
      { status: 500 }
    );
  }
}
