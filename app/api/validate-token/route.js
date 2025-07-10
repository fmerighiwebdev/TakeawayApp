import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";

export async function POST(req) {
    const { token } = await req.json();

    if (!token) {
        return NextResponse.json({ error: "Token mancante" }, { status: 401 });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return NextResponse.json({ error: "Token non valido" }, { status: 401 });
    }

    return NextResponse.json({ message: "Token valido" }, { status: 200 });
}