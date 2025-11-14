import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { nom: string } }
) {
  try {
    const nom = decodeURIComponent(params.nom);

    const checkins = await prisma.checkIn.findMany({
      where: { nom },
    });

    const avis = await prisma.avis.findMany({
      where: { nom },
      include: { appartement: true }
    });

    const services = await prisma.service.findMany({
      where: { client: nom },
      include: { appartement: true }
    });

    return NextResponse.json({
      nom,
      checkins,
      avis,
      services,
    });
  } catch (err) {
    console.error("Erreur profil client:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
