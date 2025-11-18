import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      include: { appartement: true },
    });
    return NextResponse.json(list);
  } catch (err) {
    console.error("Erreur GET /reservations:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clientNom,
      clientEmail,
      clientTel,
      appartementId,
      debut,
      fin,
      statut,
    } = body;

    if (!clientNom || !debut || !fin) {
      return NextResponse.json(
        { error: "Nom du client, dates obligatoires" },
        { status: 400 }
      );
    }

    const resa = await prisma.reservation.create({
      data: {
        clientNom,
        clientEmail,
        clientTel,
        appartementId: appartementId ? Number(appartementId) : null,
        debut: new Date(debut),
        fin: new Date(fin),
        statut: statut || "confirmée",
      },
    });

    return NextResponse.json(resa);
  } catch (err) {
    console.error("Erreur POST /reservations:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
