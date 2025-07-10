import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req, res) {
    const { user, password } = await req.json();

    console.log(user, password);

    if (!user || !password) {
        return NextResponse.json({ message: "Dati mancanti" }, { status: 400 });
    }

    const userAdmin = process.env.ADMIN_USER;
    const passwordAdmin = process.env.ADMIN_PASSWORD;

    if (user !== userAdmin || password !== passwordAdmin) {
        return NextResponse.json({ message: "Credenziali errate" }, { status: 401 });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "24h" });

    return NextResponse.json({ authToken: token }, { status: 200 });
}