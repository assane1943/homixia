import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { date: "desc" },
      include: {
        appartement: {
          select: { nom: true, ville: true },
        },
      },
    });

    return NextResponse.json(services);
  } catch (err) {
    console.error("Erreur GET services:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
