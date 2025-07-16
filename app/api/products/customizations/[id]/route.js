import { NextResponse } from "next/server";

import { getProductCustomizations } from "@/lib/products";
import { getTenantId } from "@/lib/tenantDetails";

export async function GET(req, { params }) {
  const { id } = params;
  const tenantId = await getTenantId();

  try {
    const customizations = await getProductCustomizations(id, tenantId);
    return NextResponse.json({ customizations }, { status: 200 });
  } catch (error) {
    console.error("Errore nel fetch delle personalizzazioni:", error);
    return NextResponse.json(
      { message: "Errore nel recupero delle personalizzazioni" },
      { status: 500 }
    );
  }
}
