import { NextResponse } from "next/server";
import { getItemDetails } from "@/lib/tmdb";

export async function GET(request, { params }) {
  const { type, id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const data = await getItemDetails(id, type === "tv" ? "tv" : "movie");
    if (!data) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("API details error:", error);
    return NextResponse.json({ error: "Failed to fetch item details" }, { status: 500 });
  }
}
