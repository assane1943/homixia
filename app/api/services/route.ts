import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🟢 GET → Liste tous les services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(services);
  } catch (err) {
    console.error("Erreur GET /api/services :", err);
    return NextResponse.json(
      { error: "Erreur lors du chargement des services" },
      { status: 500 }
    );
  }
}

// 🟡 POST → Ajouter un service
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nom, client, logement, prix, statut } = body;

    if (!nom || !client || !logement || !prix) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const nouveauService = await prisma.service.create({
      data: {
        nom,
        client,
        logement,
        prix,
        statut: statut || "en_attente",
      },
    });

    return NextResponse.json(nouveauService);
  } catch (err) {
    console.error("Erreur POST /api/services :", err);
    return NextResponse.json(
      { error: "Erreur lors de l’ajout du service" },
      { status: 500 }
    );
  }
}
