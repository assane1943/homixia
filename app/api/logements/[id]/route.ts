import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/logements/[id]
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const logement = await prisma.appartement.findUnique({
      where: { id: Number(id) },
    });

    if (!logement) {
      return NextResponse.json({ error: "Logement introuvable ❌" }, { status: 404 });
    }

    return NextResponse.json(logement);
  } catch (err) {
    console.error("Erreur GET /api/logements/[id]", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur ⚠️" },
      { status: 500 }
    );
  }
}

// DELETE /api/logements/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.appartement.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: "Logement supprimé ✅" });
  } catch (err) {
    console.error("Erreur DELETE /api/logements/[id]", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur ⚠️" },
      { status: 500 }
    );
  }
}
