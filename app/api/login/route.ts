import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, motDePasse } = await req.json();

    if (!email || !motDePasse) {
      return NextResponse.json(
        { error: "Email et mot de passe requis ⚠️" },
        { status: 400 }
      );
    }

    const user = await prisma.equipe.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable ❌" },
        { status: 404 }
      );
    }

    // 🚨 Vérification du mot de passe null
    if (!user.motDePasse) {
      return NextResponse.json(
        { error: "Mot de passe non défini pour cet utilisateur ❌" },
        { status: 400 }
      );
    }

    const match = await bcrypt.compare(motDePasse, user.motDePasse);

    if (!match) {
      return NextResponse.json(
        { error: "Mot de passe incorrect ❌" },
        { status: 401 }
      );
    }

    // ✅ Cookie session admin
    const res = NextResponse.json({
      success: true,
      message: "Connexion réussie ✅",
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });

    res.cookies.set(
      "homixia_session",
      JSON.stringify({
        id: user.id,
        nom: user.nom,
        role: user.role,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24, // 24h
      }
    );

    return res;
  } catch (error) {
    console.error("Erreur login:", error);
    return NextResponse.json(
      { error: "Erreur serveur ⚠️" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
