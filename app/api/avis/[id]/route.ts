import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 📌 MODIFIER UN AVIS
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const avis = await prisma.avis.update({
      where: { id: Number(params.id) },
      data: {
        nom: body.nom,
        note: body.note,
        commentaire: body.commentaire,
      },
    });

    return NextResponse.json(avis);
  } catch (err) {
    console.error("Erreur update avis:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 📌 SUPPRIMER UN AVIS
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.avis.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur delete avis:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
