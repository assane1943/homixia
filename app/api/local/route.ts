import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🔹 GET — liste des lieux
export async function GET() {
  try {
    const lieux = await prisma.local.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(lieux);
  } catch (err) {
    console.error("Erreur GET local:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 POST — ajout d’un lieu
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lieu = await prisma.local.create({ data: body });
    return NextResponse.json(lieu);
  } catch (err) {
    console.error("Erreur POST local:", err);
    return NextResponse.json({ error: "Erreur d’ajout lieu" }, { status: 500 });
  }
}
