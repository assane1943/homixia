import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/appartement  → liste complète
export async function GET() {
  try {
    const data = await prisma.appartement.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(data);
  } catch (err) {
    console.error("Erreur GET appartement:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/appartement  → ajouter
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apt = await prisma.appartement.create({
      data: body,
    });

    return NextResponse.json(apt, { status: 201 });
  } catch (err) {
    console.error("Erreur POST appartement:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
