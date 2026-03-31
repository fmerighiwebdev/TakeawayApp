import supabaseServer from "@/lib/supabaseServer";

function normalizeCode(code) {
  return (code ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

export async function validateDiscountCodeForCustomer({
  tenantId,
  customerId,
  code,
}) {
  const normalizedCode = normalizeCode(code);

  if (!normalizedCode) {
    return {
      valid: false,
      reason: "missing_code",
      discount: null,
    };
  }

  const { data: discount, error: discountError } = await supabaseServer
    .from("discount_codes")
    .select("id, code, percent_off")
    .eq("tenant_id", tenantId)
    .eq("code", normalizedCode)
    .maybeSingle();

  if (discountError) {
    throw new Error(
      discountError.message || "Errore durante la validazione del coupon."
    );
  }

  if (!discount) {
    return {
      valid: false,
      reason: "invalid_code",
      discount: null,
    };
  }

  const { data: existingRedemption, error: redemptionError } =
    await supabaseServer
      .from("discount_code_redemptions")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("discount_code_id", discount.id)
      .eq("customer_id", customerId)
      .maybeSingle();

  if (redemptionError) {
    throw new Error(
      redemptionError.message ||
        "Errore durante la verifica dell'utilizzo del coupon."
    );
  }

  if (existingRedemption) {
    return {
      valid: false,
      reason: "already_used",
      discount: null,
    };
  }

  return {
    valid: true,
    reason: null,
    discount,
  };
}

export async function registerDiscountCodeRedemption({
  tenantId,
  discountCodeId,
  customerId,
  orderId,
}) {
  const { error } = await supabaseServer
    .from("discount_code_redemptions")
    .insert({
      tenant_id: tenantId,
      discount_code_id: discountCodeId,
      customer_id: customerId,
      order_id: orderId,
    });

  if (error) {
    throw new Error(
      error.message || "Errore durante la registrazione del coupon utilizzato."
    );
  }
}