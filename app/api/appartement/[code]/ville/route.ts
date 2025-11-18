import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> } // ⚠️ OBLIGATOIRE
) {
  try {
    const { code } = await ctx.params; // ⚠️ FIX Next.js 16

    if (!code) {
      return NextResponse.json(
        { error: "Code appartement manquant" },
        { status: 400 }
      );
    }

    // 1️⃣ Récupération appartement
    const appartement = await prisma.appartement.findUnique({
      where: { code },
      select: {
        ville: true,
        pays: true,
      },
    });

    if (!appartement) {
      return NextResponse.json(
        { error: "Appartement introuvable" },
        { status: 404 }
      );
    }

    // 2️⃣ Lieux de la ville
    const lieux = await prisma.localContent.findMany({
      where: { ville: appartement.ville },
      orderBy: { id: "desc" },
    });

    // 3️⃣ Normalisation des données front
    const mapped = lieux.map((l) => ({
      categorie: l.categorie as "restaurant" | "lieu",
      nom: l.nom,
      type: l.type,
      description: "",
      adresse: l.adresse || undefined,
      horaire: l.horaire || "Non renseigné",
      lat: l.lat ?? 0,
      lng: l.lng ?? 0,
      image: l.image || undefined,
    }));

    return NextResponse.json({
      ville: appartement.ville,
      pays: appartement.pays,
      lieux: mapped,
    });
  } catch (err) {
    console.error("Erreur GET /appartement/[code]/ville:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
