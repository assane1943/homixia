import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Simplifié pour contourner le typage Turbopack
export async function GET(req: any, context: any) {
  const { id } = await context.params;
  const service = await prisma.service.findUnique({ where: { id: Number(id) } });
  if (!service) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(service);
}

export async function PUT(req: any, context: any) {
  const { id } = await context.params;
  const data = await req.json();
  const service = await prisma.service.update({ where: { id: Number(id) }, data });
  return NextResponse.json(service);
}

export async function DELETE(req: any, context: any) {
  const { id } = await context.params;
  await prisma.service.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
