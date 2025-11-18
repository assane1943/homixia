// app/api/appartements/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 GET — liste des appartements
export async function GET() {
  try {
    const data = await prisma.appartement.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("Erreur GET /api/appartements:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// 🔹 POST — ajouter un appartement
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apt = await prisma.appartement.create({
      data: body,
    });

    return NextResponse.json(apt, { status: 201 });
  } catch (err) {
    console.error("Erreur POST /api/appartements:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
