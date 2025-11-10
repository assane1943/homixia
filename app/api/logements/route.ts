import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🟢 GET → Liste des logements
export async function GET() {
  try {
    const logements = await prisma.appartement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(logements);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur de récupération" }, { status: 500 });
  }
}

// 🟢 POST → Ajouter un logement
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const logement = await prisma.appartement.create({ data });
    return NextResponse.json(logement);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
  }
}
