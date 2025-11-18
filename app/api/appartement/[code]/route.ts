import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await ctx.params;

    if (!code) {
      return NextResponse.json(
        { error: "Code manquant" },
        { status: 400 }
      );
    }

    const apt = await prisma.appartement.findUnique({
      where: { code },
    });

    if (!apt) {
      return NextResponse.json(
        { error: "Appartement introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(apt);
  } catch (err) {
    console.error("Erreur GET appartement/code:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await ctx.params;
    const data = await req.json();

    const apt = await prisma.appartement.update({
      where: { code },
      data,
    });

    return NextResponse.json(apt);
  } catch (err) {
    console.error("Erreur PUT appartement/code:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await ctx.params;

    await prisma.appartement.delete({
      where: { code },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE appartement/code:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
