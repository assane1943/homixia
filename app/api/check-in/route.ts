import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔒 Vérification minimum
    if (!body.nom || !body.signature) {
      return NextResponse.json(
        { error: "Informations incomplètes" },
        { status: 400 }
      );
    }

    // 🧾 Enregistrement dans Neon (Prisma)
    const saved = await prisma.checkIn.create({
      data: {
        nom: body.nom,
        accepted: body.accepted ?? false,
        signature: body.signature,
        passportUrl: body.passportUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      checkinId: saved.id,
    });
  } catch (error) {
    console.error("Erreur CheckIn API:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
