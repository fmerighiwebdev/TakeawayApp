import supabase from "./supabaseClient";
import { headers } from "next/headers";

export function getTenantId() {
    const tenantId = headers().get("x-tenant-id");
    if (!tenantId) {
        throw new Error("Tenant ID non trovato negli headers");
    }
    return tenantId;
}

export async function getTenantDetails(tenantId) {
    const { data: tenantData, error } = await supabase
        .from("tenants")
        .select("name, address, phone, email, slogan, tax, legal_name, website_url")
        .eq("id", tenantId)
        .single();

    if (error || !tenantData) {
        throw new Error(error?.message || "Tenant non trovato");
    }

    return tenantData;
}

export async function getTenantTheme(tenantId) {
    const { data: tenantData, error } = await supabase
        .from("tenants")
        .select("theme")
        .eq("id", tenantId)
        .single();

    if (error || !tenantData) {
        throw new Error(error?.message || "Tema del tenant non trovato");
    }

    return tenantData.theme;
}