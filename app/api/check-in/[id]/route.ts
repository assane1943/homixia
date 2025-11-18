import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await req.json();

    const item = await prisma.checkIn.update({
      where: { id },
      data,
    });

    return NextResponse.json(item);
  } catch (err) {
    console.error("Erreur PUT /checkin/[id]:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
