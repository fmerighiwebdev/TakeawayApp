import { NextResponse } from "next/server";

import { getProductsByCategory } from "@/lib/products";
import { categoryNames } from "@/lib/categories";

export async function GET(req, { params }) {
  const { category: categorySlug } = await params;

  if (!Object.keys(categoryNames).includes(categorySlug)) {
    return NextResponse.json({ message: "Categoria non valida" }, { status: 400 });
  }

  try {
    const rows = await getProductsByCategory(categorySlug);
    return NextResponse.json({ products: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Errore nel caricamento dei prodotti" }, { status: 500 });
  }
}
