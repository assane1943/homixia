// app/api/appartements/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 GET — un appartement par ID
export async function GET(
  _req: Request,
  ctx: { params: { id: string } }
) {
  try {
    const id = Number(ctx.params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    const apt = await prisma.appartement.findUnique({
      where: { id },
    });

    if (!apt) {
      return NextResponse.json(
        { error: "Appartement introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(apt);
  } catch (err) {
    console.error("Erreur GET /api/appartements/[id]:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// 🔹 PUT — modifier un appartement
export async function PUT(
  req: Request,
  ctx: { params: { id: string } }
) {
  try {
    const id = Number(ctx.params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    const data = await req.json();

    const apt = await prisma.appartement.update({
      where: { id },
      data,
    });

    return NextResponse.json(apt);
  } catch (err) {
    console.error("Erreur PUT /api/appartements/[id]:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// 🔹 DELETE — supprimer un appartement
export async function DELETE(
  _req: Request,
  ctx: { params: { id: string } }
) {
  try {
    const id = Number(ctx.params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    await prisma.appartement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE /api/appartements/[id]:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
