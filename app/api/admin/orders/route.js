import { NextResponse } from "next/server";

import { getTenantOrdersByStatus } from "@/lib/orders";

import jwt from "jsonwebtoken";
import { getTenantId } from "@/lib/tenantDetails";
import { cookies } from "next/headers";

function verifyToken(token) {
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
}

export async function GET(req) {
    const tenantId = getTenantId();
    const cookieStore = cookies();
    const cookieKey = `auth-token-${tenantId}`;
    const token = cookieStore.get(cookieKey)?.value;

    if (!verifyToken(token)) {
        return NextResponse.json({ error: 'Non sei autenticato.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const orderStatus = status === "waiting" ? "In Attesa" : "Completato";
    const orders = await getTenantOrdersByStatus(tenantId, orderStatus);

    return NextResponse.json({ orders: orders }, { status: 200 });
}