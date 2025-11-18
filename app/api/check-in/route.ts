import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Créer un check-in
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nom,
      accepted,
      signatureUrl,
      passportUrl,
      appartementCode,
    } = body;

    if (!nom || !accepted || !signatureUrl || !appartementCode) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // Vérifier que l'appartement existe via le code
    const appartement = await prisma.appartement.findUnique({
      where: { code: appartementCode },
    });

    if (!appartement) {
      return NextResponse.json(
        { error: "Appartement introuvable" },
        { status: 404 }
      );
    }

    // --- Création du check-in ---
    const checkin = await prisma.checkIn.create({
      data: {
        nom,
        accepted: true,
        signature: signatureUrl,
        passportUrl: passportUrl || null,

        // ✔ RELATION CORRECTE via le code
        appartementCode,
      },
    });

    return NextResponse.json(checkin, { status: 201 });
  } catch (err) {
    console.error("Erreur création check-in:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// ✅ Lister
export async function GET() {
  try {
    const checkins = await prisma.checkIn.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        appartement: {
          select: { nom: true, code: true },
        },
      },
    });

    return NextResponse.json(checkins);
  } catch (err) {
    console.error("Erreur récupération check-in:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
