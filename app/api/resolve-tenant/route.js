import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  // Controlla se il dominio è presente nel database
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("domain", domain)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Tenant non trovato" }, { status: 404 });
  }

  return NextResponse.json(data);
}
