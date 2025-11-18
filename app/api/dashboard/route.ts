  import { NextResponse } from "next/server";
  import { prisma } from "@/lib/prisma";

  export async function GET() {
    try {
      const [appartements, reservations, services, avis, checkins] =
        await Promise.all([
          prisma.appartement.count(),
          prisma.reservation.count(),
          prisma.service.count(),
          prisma.avis.count(),
          prisma.checkIn.count(),
        ]);

      return NextResponse.json({
        stats: {
          appartements,
          reservations,
          services,
          avis,
          checkins,
        },
      });
    } catch (err) {
      console.error("Erreur dashboard admin:", err);
      return NextResponse.json(
        { error: "Erreur serveur dashboard" },
        { status: 500 }
      );
    }
  }
