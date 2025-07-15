import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import supabase from "@/lib/supabaseClient";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { user, password, tenantId } = await req.json();

  if (!user || !password || !tenantId) {
    return NextResponse.json({ message: "Dati mancanti" }, { status: 400 });
  }

  // Cerca l'utente nel DB
  const { data: admin, error } = await supabase
    .from("tenant_admins")
    .select("*")
    .eq("username", user)
    .eq("tenant_id", tenantId)
    .single();

  if (error || !admin) {
    return NextResponse.json(
      { message: "Credenziali errate" },
      { status: 401 }
    );
  }

  // Verifica la password
  const passwordMatch = await bcrypt.compare(password, admin.password_hash);

  if (!passwordMatch) {
    return NextResponse.json(
      { message: "Credenziali errate" },
      { status: 401 }
    );
  }

  // Genera JWT
  const token = jwt.sign(
    {
      tenantId: tenantId,
      userId: admin.id,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return NextResponse.json({ authToken: token }, { status: 200 });
}