import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 📌 GET — Récupérer tous les avis
export async function GET() {
  try {
    const avis = await prisma.avis.findMany({
      orderBy: { date: "desc" },
    });

    return NextResponse.json(avis);
  } catch (err) {
    console.error("Erreur GET avis:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des avis" },
      { status: 500 }
    );
  }
}

// 📌 POST — Ajouter un nouvel avis
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nom || !body.note) {
      return NextResponse.json(
        { error: "Nom et note requis" },
        { status: 400 }
      );
    }

    const avis = await prisma.avis.create({
      data: {
        nom: body.nom,
        note: Number(body.note),
        commentaire: body.commentaire || "",
        appartementId: body.appartementId ? Number(body.appartementId) : null,
      },
    });

    return NextResponse.json({ success: true, avis });
  } catch (err) {
    console.error("Erreur POST avis:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l’ajout de l’avis" },
      { status: 500 }
    );
  }
}
