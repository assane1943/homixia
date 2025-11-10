import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 GET — Récupération des avis
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const note = searchParams.get("note");

    const avis = await prisma.avis.findMany({
      where: note ? { note: parseInt(note) } : {},
      orderBy: { date: "desc" },
    });

    return NextResponse.json(Array.isArray(avis) ? avis : []);
  } catch (error) {
    console.error("Erreur lors du chargement des avis :", error);
    return NextResponse.json([]);
  }
}

// 🔹 POST — Ajouter un avis
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nom, note, commentaire } = body;

    if (!nom || !note || !commentaire) {
      return NextResponse.json(
        { error: "Champs manquants ⚠️" },
        { status: 400 }
      );
    }

    const avis = await prisma.avis.create({
      data: { nom, note, commentaire },
    });

    return NextResponse.json(avis);
  } catch (error) {
    console.error("Erreur ajout avis :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
