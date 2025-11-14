import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// 🔹 Lister toute l'équipe
export async function GET() {
  try {
    const equipe = await prisma.equipe.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(equipe);
  } catch (err) {
    console.error("Erreur GET équipe:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 Ajouter un membre
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Vérifier email unique
    const exists = await prisma.equipe.findUnique({
      where: { email: body.email },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Cet email existe déjà" },
        { status: 400 }
      );
    }

    // Hash du mot de passe
    const hash = await bcrypt.hash(body.motDePasse, 10);

    const member = await prisma.equipe.create({
      data: {
        nom: body.nom,
        email: body.email,
        role: body.role || "admin",
        telephone: body.telephone || null,
        motDePasse: hash,
      },
    });

    return NextResponse.json(member);
  } catch (err) {
    console.error("Erreur POST équipe:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
