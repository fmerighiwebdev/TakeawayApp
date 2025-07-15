import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";

export async function POST(req) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "Token mancante" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({
      message: "Token valido",
      tenantId: decoded.tenantId,
      userId: decoded.userId,
      role: decoded.role,
    });
  } catch (error) {
    return NextResponse.json({ error: "Token non valido" }, { status: 401 });
  }
}