// app/api/avis/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.avis.findMany({
      where: { visible: true },
      orderBy: { date: "desc" },
      include: {
        appartement: { select: { nom: true } },
      },
    });

    return NextResponse.json(list);
  } catch (err) {
    console.error("Erreur GET /avis:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
