import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🟢 GET → Récupérer un logement précis
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const logement = await prisma.appartement.findUnique({
      where: { id: Number(params.id) },
    });

    if (!logement) {
      return NextResponse.json({ error: "Logement introuvable" }, { status: 404 });
    }

    return NextResponse.json(logement);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🟡 PUT → Modifier un logement
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const logement = await prisma.appartement.update({
      where: { id: Number(params.id) },
      data,
    });

    return NextResponse.json(logement);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du logement" },
      { status: 500 }
    );
  }
}

// 🔴 DELETE → Supprimer un logement
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.appartement.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du logement" },
      { status: 500 }
    );
  }
}
