import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.localContent.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE local-content:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
