// app/api/appartement/[code]/services/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> }
) {
  try {
    // ⚠️ OBLIGATOIRE : Next 16 → params est une PROMISE
    const { code } = await ctx.params;

    if (!code) {
      return NextResponse.json(
        { error: "Code appartement manquant" },
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

    const services = await prisma.service.findMany({
      where: { appartementId: appartement.id },
      orderBy: { date: "desc" },
      select: {
        id: true,
        nom: true,
        whatsappMessage: true,
        statut: true,
        date: true,
      },
    });

    return NextResponse.json(services);
  } catch (err) {
    console.error("Erreur GET /appartement/[code]/services:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
