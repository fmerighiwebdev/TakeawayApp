import pool from "@/lib/supabaseClient";

import { NextResponse } from "next/server";

import { getAllProducts } from "@/lib/products";

export async function GET(req, res) {
  const rows = await getAllProducts();
  return NextResponse.json({ products: rows }, { status: 200 });
}
