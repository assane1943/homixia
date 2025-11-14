import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 🔹 SERVICES
    const services = await prisma.service.findMany();
    const totalServices = services.length;

    const servicesStats = {
      en_attente: services.filter((s) => s.statut === "en_attente").length,
      planifie: services.filter((s) => s.statut === "planifié").length,
      termine: services.filter((s) => s.statut === "terminé").length,
    };

    // 🔹 AVIS
    const avis = await prisma.avis.findMany();
    const noteMoyenne =
      avis.length > 0
        ? (
            avis.reduce((acc, a) => acc + a.note, 0) / avis.length
          ).toFixed(1)
        : "0.0";

    // Groupement des avis par mois
    const avisMonthly = avis.reduce((acc: any, a) => {
      const key = new Date(a.date).toLocaleString("fr-FR", {
        month: "short",
        year: "numeric",
      });
      acc[key] = acc[key] ? [...acc[key], a.note] : [a.note];
      return acc;
    }, {});

    const avisChart = Object.entries(avisMonthly).map(([mois, notes]: any) => ({
      mois,
      moyenne: (notes.reduce((a: number, b: number) => a + b, 0) / notes.length).toFixed(1),
    }));

    // 🔹 CHECK-IN
    const checkins = await prisma.checkIn.findMany();
    const checkinsMonthly = checkins.reduce((acc: any, c) => {
      const key = new Date(c.createdAt).toLocaleString("fr-FR", {
        month: "short",
        year: "numeric",
      });

      acc[key] = acc[key] ? acc[key] + 1 : 1;
      return acc;
    }, {});

    const checkinChart = Object.entries(checkinsMonthly).map(
      ([mois, count]: any) => ({
        mois,
        total: count,
      })
    );

    return NextResponse.json({
      stats: {
        totalServices,
        noteMoyenne,
        servicesStats,
        totalCheckins: checkins.length,
      },
      charts: {
        checkinChart,
        avisChart,
      },
    });
  } catch (err) {
    console.error("Erreur Dashboard PRO:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
