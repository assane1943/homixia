import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, motDePasse } = await req.json();

    if (!email || !motDePasse) {
      return NextResponse.json(
        { error: "Email ou mot de passe manquant" },
        { status: 400 }
      );
    }

    const admin = await prisma.equipe.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // Vérifier mot de passe hashé
    const valid = bcrypt.compareSync(motDePasse, admin.motDePasse || "");
    if (!valid) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      nom: admin.nom,
      email: admin.email,
    });
  } catch (err) {
    console.error("Erreur login admin:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
