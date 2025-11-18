import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Liste services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { date: "desc" },
      include: {
        appartement: { select: { id: true, nom: true, code: true } },
      },
    });

    return NextResponse.json(services);
  } catch (err) {
    console.error("Erreur GET /services:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Ajouter un service
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nom, whatsappMessage, appartementId } = body;

    if (!nom) {
      return NextResponse.json(
        { error: "Nom du service requis" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        nom,
        whatsappMessage: whatsappMessage || "",
        statut: "en_attente",
        appartementId: appartementId ? Number(appartementId) : null,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    console.error("Erreur POST /services:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
