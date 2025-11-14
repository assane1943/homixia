import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    let data: any = {
      nom: body.nom,
      email: body.email,
      role: body.role,
      telephone: body.telephone,
    };

    if (body.motDePasse && body.motDePasse.length > 0) {
      data.motDePasse = await bcrypt.hash(body.motDePasse, 10);
    }

    const updated = await prisma.equipe.update({
      where: { id: Number(params.id) },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Erreur update équipe:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.equipe.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur delete équipe:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
