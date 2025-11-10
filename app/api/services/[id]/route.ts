import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🟢 PUT → Modifier un service
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const updated = await prisma.service.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Erreur PUT /api/services/[id] :", err);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du service" },
      { status: 500 }
    );
  }
}

// 🔴 DELETE → Supprimer un service
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.service.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE /api/services/[id] :", err);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du service" },
      { status: 500 }
    );
  }
}
