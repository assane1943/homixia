import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const place_id = searchParams.get("place_id");

    if (!place_id) {
      return NextResponse.json({ error: "place_id requis" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,geometry,formatted_address,types,opening_hours,photos,url&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json({ error: "Lieu introuvable" }, { status: 404 });
    }

    const p = data.result;

    let photoUrl = null;
    if (p.photos?.length > 0) {
      photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${p.photos[0].photo_reference}&key=${apiKey}`;
    }

    return NextResponse.json({
      place_id,
      nom: p.name,
      adresse: p.formatted_address,
      type: p.types?.[0] || "",
      lat: p.geometry?.location?.lat,
      lng: p.geometry?.location?.lng,
      horaire: p.opening_hours?.weekday_text?.join(" • ") || "Non disponible",
      image: photoUrl,
      googleUrl: p.url || `https://www.google.com/maps/search/?api=1&query=${p.name}`,
    });
  } catch (err) {
    console.error("Erreur details:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
