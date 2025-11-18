// app/api/maps/search/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ suggestions: [] });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&components=country:ma&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data.predictions);
  } catch (err) {
    console.error("Erreur autocomplete:", err);
    return NextResponse.json({ suggestions: [] });
  }
}
