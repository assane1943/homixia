import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, motDePasse } = await req.json();

    console.log("📩 Requête reçue :", { email, motDePasse });

    if (!email || !motDePasse) {
      return NextResponse.json(
        { error: "Email et mot de passe requis ⚠️" },
        { status: 400 }
      );
    }

    // 🔎 Vérification utilisateur
    const user = await prisma.equipe.findUnique({
      where: { email },
    });

    console.log("🔎 Utilisateur trouvé :", user);

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable ❌" },
        { status: 404 }
      );
    }

    if (!user.motDePasse) {
      console.log("❌ motDePasse est NULL dans la DB !");
      return NextResponse.json(
        { error: "Mot de passe non défini pour cet utilisateur ❌" },
        { status: 400 }
      );
    }

    // 🔐 Vérification du mot de passe
    const match = await bcrypt.compare(motDePasse, user.motDePasse);

    console.log("🔐 Match bcrypt :", match);

    if (!match) {
      return NextResponse.json(
        { error: "Mot de passe incorrect ❌" },
        { status: 401 }
      );
    }

    // 🎉 Succès
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

    // 🍪 Cookie de session
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
        maxAge: 60 * 60 * 24,
      }
    );

    return res;

  } catch (error: any) {
    console.error("🔥 Erreur login (détail complet):", error?.message || error);

    return NextResponse.json(
      { error: "Erreur serveur ⚠️" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
