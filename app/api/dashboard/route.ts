import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const APPARTEMENT_TEST_CODE = "HX-CASA-001";

export async function GET() {
  try {
    const appartement = await prisma.appartement.findUnique({
      where: { code: APPARTEMENT_TEST_CODE },
      include: {
        avis: true,
        services: true,
      },
    });

    if (!appartement) {
      return NextResponse.json(
        { error: "Appartement Anfa introuvable" },
        { status: 404 }
      );
    }

    // 🔹 Calcul des indicateurs
    const noteMoyenne =
      appartement.avis.length > 0
        ? appartement.avis.reduce((acc, a) => acc + a.note, 0) /
          appartement.avis.length
        : 0;

    const totalServices = appartement.services.length;
    const actifs = appartement.services.filter(
      (s) => s.statut === "planifié"
    ).length;
    const aVenir = appartement.services.filter(
      (s) => s.statut === "en_attente"
    ).length;

    // 🔹 Notifications dynamiques
    const notifications = [];

    // Services à venir
    appartement.services
      .filter((s) => s.statut === "en_attente")
      .forEach((s) =>
        notifications.push({
          id: s.id,
          message: `🕒 Service "${s.nom}" prévu pour ${s.client}`,
          type: "service",
        })
      );

    // Services planifiés
    appartement.services
      .filter((s) => s.statut === "planifié")
      .forEach((s) =>
        notifications.push({
          id: s.id,
          message: `✅ Service "${s.nom}" actuellement en cours`,
          type: "service",
        })
      );

    // Services terminés
    appartement.services
      .filter((s) => s.statut === "terminé")
      .forEach((s) =>
        notifications.push({
          id: s.id,
          message: `🎉 Service "${s.nom}" terminé avec succès`,
          type: "success",
        })
      );

    // Si aucun service → message de veille
    if (notifications.length === 0) {
      notifications.push({
        id: 0,
        message: "Aucune notification pour le moment 😴",
        type: "info",
      });
    }

    return NextResponse.json({
      nom: appartement.nom,
      ville: appartement.ville,
      noteMoyenne: noteMoyenne.toFixed(1),
      totalServices,
      actifs,
      aVenir,
      notifications,
    });
  } catch (err) {
    console.error("Erreur Dashboard:", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
