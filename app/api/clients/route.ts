import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 🔹 Récupérer toutes les sources de clients
    const checkins = await prisma.checkIn.findMany();
    const avis = await prisma.avis.findMany();
    const services = await prisma.service.findMany();

    // 🔹 Unifier les noms
    const set = new Set<string>();

    checkins.forEach((c) => set.add(c.nom));
    avis.forEach((a) => set.add(a.nom));
    services.forEach((s) => set.add(s.client));

    const clients = [...set].map((nom) => {
      return {
        nom,
        checkins: checkins.filter((c) => c.nom === nom).length,
        avis: avis.filter((a) => a.nom === nom).length,
        services: services.filter((s) => s.client === nom).length,
      };
    });

    return NextResponse.json(clients);
  } catch (err) {
    console.error("Erreur GET clients:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
