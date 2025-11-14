import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const service = await prisma.service.update({
      where: { id: Number(params.id) },
      data: { statut: body.statut },
    });

    return NextResponse.json(service);
  } catch (err) {
    console.error("Erreur UPDATE service:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

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
    console.error("Erreur DELETE service:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
