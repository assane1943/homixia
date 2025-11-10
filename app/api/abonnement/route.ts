import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🔹 GET — statut du pack
export async function GET() {
  try {
    const pack = await prisma.abonnement.findFirst({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pack || {});
  } catch (err) {
    console.error("Erreur GET abonnement:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
