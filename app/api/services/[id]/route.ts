import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ⚡ FIX NEXT 16
    const serviceId = Number(id);

    if (!serviceId || isNaN(serviceId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    const exists = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!exists) {
      return NextResponse.json(
        { error: "Service introuvable" },
        { status: 404 }
      );
    }

    await prisma.service.delete({
      where: { id: serviceId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE /services/[id]:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
