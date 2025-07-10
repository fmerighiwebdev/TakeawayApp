import { NextResponse } from "next/server";

import { getOrdersByStatus } from "@/lib/orders";

import jwt from "jsonwebtoken";

function verifyToken(token) {
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
}

export async function GET(req) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Non sei autenticato.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!verifyToken(token)) {
        return NextResponse.json({ error: 'Non sei autenticato.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const orderStatus = status === "waiting" ? "In Attesa" : "Completato";
    const orders = await getOrdersByStatus(orderStatus);

    return NextResponse.json({ orders: orders }, { status: 200 });
}