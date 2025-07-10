import { NextResponse } from "next/server";

import { getCustomizationsByProductId } from "@/lib/products";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const customizations = await getCustomizationsByProductId(id);
    return NextResponse.json({ customizations }, { status: 200 });
  } catch (error) {
    console.error("Errore nel fetch delle personalizzazioni:", error);
    return NextResponse.json(
      { message: "Errore nel recupero delle personalizzazioni" },
      { status: 500 }
    );
  }
}