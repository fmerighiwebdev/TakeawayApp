// lib/customers.js
import supabaseServer from "@/lib/supabaseServer";
import { normalizeEmail, normalizePhone } from "@/lib/orderRequest";

export async function findOrCreateCustomerFromOrder({
  tenantId,
  firstName,
  lastName,
  email,
  phone,
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

  const nowIso = new Date().toISOString();

  // 1. Match per email
  const { data: customerByEmail, error: emailLookupError } = await supabaseServer
    .from("customers")
    .select("id")
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
        .select("id")
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

  // 3. Se esiste, aggiorna solo i dati anagrafici base
  if (existingCustomer) {
    const { error: updateError } = await supabaseServer
      .from("customers")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
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

  // 4. Altrimenti crea nuovo cliente senza metriche ordine
  const { data: createdCustomer, error: insertError } = await supabaseServer
    .from("customers")
    .insert({
      tenant_id: tenantId,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      orders_count: 0,
      total_spent: 0,
      last_order_at: null,
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

export async function updateCustomerOrderStats({
  customerId,
  orderTotal,
}) {
  if (!customerId) {
    throw new Error("customerId mancante.");
  }

  if (typeof orderTotal !== "number" || Number.isNaN(orderTotal)) {
    throw new Error("orderTotal non valido.");
  }

  const { data: customer, error: customerError } = await supabaseServer
    .from("customers")
    .select("id, orders_count, total_spent")
    .eq("id", customerId)
    .single();

  if (customerError || !customer) {
    throw new Error(customerError?.message || "Cliente non trovato.");
  }

  const nextOrdersCount = (customer.orders_count ?? 0) + 1;
  const nextTotalSpent =
    Number(customer.total_spent ?? 0) + Number(orderTotal);

  const { error: updateError } = await supabaseServer
    .from("customers")
    .update({
      orders_count: nextOrdersCount,
      total_spent: Number(nextTotalSpent.toFixed(2)),
      last_order_at: new Date().toISOString(),
    })
    .eq("id", customerId);

  if (updateError) {
    throw new Error(
      updateError.message || "Errore aggiornamento statistiche cliente."
    );
  }
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

export async function findCustomerByIdentity({
  tenantId,
  email,
  phone,
}) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);

  if (!tenantId) {
    throw new Error("tenantId mancante.");
  }

  if (!normalizedEmail && !normalizedPhone) {
    return null;
  }

  if (normalizedEmail) {
    const { data: customerByEmail, error: emailLookupError } =
      await supabaseServer
        .from("customers")
        .select("id")
        .eq("tenant_id", tenantId)
        .eq("normalized_email", normalizedEmail)
        .maybeSingle();

    if (emailLookupError) {
      throw new Error(
        emailLookupError.message || "Errore ricerca cliente per email."
      );
    }

    if (customerByEmail) {
      return customerByEmail;
    }
  }

  if (normalizedPhone) {
    const { data: customerByPhone, error: phoneLookupError } =
      await supabaseServer
        .from("customers")
        .select("id")
        .eq("tenant_id", tenantId)
        .eq("normalized_phone", normalizedPhone)
        .maybeSingle();

    if (phoneLookupError) {
      throw new Error(
        phoneLookupError.message || "Errore ricerca cliente per telefono."
      );
    }

    if (customerByPhone) {
      return customerByPhone;
    }
  }

  return null;
}
