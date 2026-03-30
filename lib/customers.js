// lib/customers.js
import supabaseServer from "@/lib/supabaseServer";

function normalizeEmail(email) {
  return (email ?? "").trim().toLowerCase();
}

function normalizePhone(phone) {
  return (phone ?? "").replace(/\D/g, "");
}

export async function upsertCustomerFromOrder({
  tenantId,
  firstName,
  lastName,
  email,
  phone,
  orderTotal,
  privacyConsent = false,
}) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);

  if (!tenantId) {
    throw new Error("tenantId mancante.");
  }

  if (!firstName || !lastName || !normalizedEmail || !normalizedPhone) {
    throw new Error("Dati cliente incompleti.");
  }

  if (typeof orderTotal !== "number" || Number.isNaN(orderTotal)) {
    throw new Error("orderTotal non valido.");
  }

  const nowIso = new Date().toISOString();

  // 1. Prova match per email
  const { data: customerByEmail, error: emailLookupError } = await supabaseServer
    .from("customers")
    .select("id, orders_count, total_spent")
    .eq("tenant_id", tenantId)
    .eq("normalized_email", normalizedEmail)
    .maybeSingle();

  if (emailLookupError) {
    throw new Error(
      emailLookupError.message || "Errore ricerca cliente per email."
    );
  }

  let existingCustomer = customerByEmail;

  // 2. Fallback match per telefono
  if (!existingCustomer) {
    const { data: customerByPhone, error: phoneLookupError } =
      await supabaseServer
        .from("customers")
        .select("id, orders_count, total_spent")
        .eq("tenant_id", tenantId)
        .eq("normalized_phone", normalizedPhone)
        .maybeSingle();

    if (phoneLookupError) {
      throw new Error(
        phoneLookupError.message || "Errore ricerca cliente per telefono."
      );
    }

    existingCustomer = customerByPhone;
  }

  // 3. Se esiste, aggiorna metriche e dati anagrafici
  if (existingCustomer) {
    const nextOrdersCount = (existingCustomer.orders_count ?? 0) + 1;
    const nextTotalSpent =
      Number(existingCustomer.total_spent ?? 0) + Number(orderTotal);

    const { error: updateError } = await supabaseServer
      .from("customers")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        orders_count: nextOrdersCount,
        total_spent: Number(nextTotalSpent.toFixed(2)),
        last_order_at: nowIso,
        privacy_consent: privacyConsent,
        privacy_consent_at: privacyConsent ? nowIso : null,
      })
      .eq("id", existingCustomer.id);

    if (updateError) {
      throw new Error(
        updateError.message || "Errore aggiornamento cliente esistente."
      );
    }

    return existingCustomer.id;
  }

  // 4. Altrimenti crea nuovo cliente
  const { data: createdCustomer, error: insertError } = await supabaseServer
    .from("customers")
    .insert({
      tenant_id: tenantId,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      orders_count: 1,
      total_spent: Number(orderTotal.toFixed(2)),
      last_order_at: nowIso,
      privacy_consent: privacyConsent,
      privacy_consent_at: privacyConsent ? nowIso : null,
    })
    .select("id")
    .single();

  if (insertError || !createdCustomer) {
    throw new Error(insertError?.message || "Errore creazione cliente.");
  }

  return createdCustomer.id;
}

export async function getCustomers(tenantId) {
  if (!tenantId) {
    throw new Error("tenantId mancante.");
  }

    const { data, error } = await supabaseServer
    .from("customers")
    .select("id, full_name, normalized_email, normalized_phone, orders_count, total_spent, last_order_at")
    .eq("tenant_id", tenantId)
    .order("last_order_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Errore recupero clienti.");
  }

  return data;
}