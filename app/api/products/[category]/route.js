import { NextResponse } from "next/server";

import { getTenantProductsByCategory } from "@/lib/products";
import { getTenantCategories, getTenantId } from "@/lib/tenantDetails";

export async function GET(req, { params }) {
  const { category: categoryId } = await params;

  const tenantId = getTenantId();
  const tenantCategories = await getTenantCategories(tenantId);

  if (!tenantCategories.some((category) => category.id === categoryId)) {
    return NextResponse.json(
      { message: "Categoria non trovata" },
      { status: 404 }
    );
  }

  try {
    const rows = await getTenantProductsByCategory(categoryId, tenantId);
    return NextResponse.json({ products: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Errore nel caricamento dei prodotti" },
      { status: 500 }
    );
  }
}
