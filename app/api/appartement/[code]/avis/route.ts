import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET AVIS
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> } // ⚠️ Next 16 requires Promise
) {
  try {
    const { code } = await ctx.params; // ⚠️ OBLIGATOIRE

    if (!code) {
      return NextResponse.json({ error: "Code manquant" }, { status: 400 });
    }

    const appartement = await prisma.appartement.findUnique({
      where: { code },
      select: { id: true },
    });

    if (!appartement) {
      return NextResponse.json(
        { error: "Appartement introuvable" },
        { status: 404 }
      );
    }

    const avis = await prisma.avis.findMany({
      where: { appartementId: appartement.id, visible: true },
      orderBy: { date: "desc" },
      select: {
        id: true,
        nom: true,
        note: true,
        commentaire: true,
        date: true,
      },
    });

    return NextResponse.json(avis); // Toujours un tableau
  } catch (err) {
    console.error("Erreur GET avis appartement:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST AVIS
export async function POST(
  req: Request,
  ctx: { params: Promise<{ code: string }> } // ⚠️ pareil ici
) {
  try {
    const { code } = await ctx.params; // ⚠️ OBLIGATOIRE

    const { nom, note, commentaire } = await req.json();

    if (!nom || !note || !commentaire) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    const appartement = await prisma.appartement.findUnique({
      where: { code },
      select: { id: true },
    });

    if (!appartement) {
      return NextResponse.json(
        { error: "Appartement introuvable" },
        { status: 404 }
      );
    }

    const newAvis = await prisma.avis.create({
      data: {
        nom,
        note,
        commentaire,
        appartementId: appartement.id,
      },
    });

    return NextResponse.json(newAvis, { status: 201 });
  } catch (err) {
    console.error("Erreur POST avis appartement:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
