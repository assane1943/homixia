import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const data = await req.json();

    const resa = await prisma.reservation.update({
      where: { id },
      data: {
        ...data,
        appartementId: data.appartementId
          ? Number(data.appartementId)
          : undefined,
      },
    });

    return NextResponse.json(resa);
  } catch (err) {
    console.error("Erreur PUT /reservations/[id]:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    await prisma.reservation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE /reservations/[id]:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
