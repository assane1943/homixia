import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.localContent.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { ville, categorie, nom, adresse, lat, lng, type, horaire, image } = body;

    if (!nom || !lat || !lng) {
      return NextResponse.json(
        { error: "Infos Google Maps manquantes" },
        { status: 400 }
      );
    }

    const saved = await prisma.localContent.create({
      data: {
        ville,
        categorie,
        nom,
        adresse: adresse || "",
        lat,
        lng,
        type: type || "",
        horaire: horaire || "",
        image: image || "",
      },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error("Erreur local-content:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id)
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    await prisma.localContent.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
