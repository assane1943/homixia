import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🔹 GET — liste des membres
export async function GET() {
  try {
    const membres = await prisma.equipe.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(membres);
  } catch (err) {
    console.error("Erreur GET équipe:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 POST — ajout d’un membre
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const membre = await prisma.equipe.create({ data: body });
    return NextResponse.json(membre);
  } catch (err) {
    console.error("Erreur POST équipe:", err);
    return NextResponse.json({ error: "Erreur d’ajout membre" }, { status: 500 });
  }
}

// 🔹 DELETE — suppression d’un membre
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.equipe.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE équipe:", err);
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
