import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CODE_APPARTEMENT = "HX-CASA-001";

export async function GET() {
  try {
    const appartement = await prisma.appartement.findUnique({
      where: { code: CODE_APPARTEMENT },
      include: {
        avis: true,
        services: true,
      },
    });

    if (!appartement) {
      return NextResponse.json(
        { error: "Appartement introuvable" },
        { status: 404 }
      );
    }

    // ⭐ Note moyenne
    const noteMoyenne =
      appartement.avis.length > 0
        ? (
            appartement.avis.reduce((acc, a) => acc + a.note, 0) /
            appartement.avis.length
          ).toFixed(1)
        : "0.0";

    // 📦 Services
    const totalServices = appartement.services.length;

    const actifs = appartement.services.filter(
      (s) => s.statut === "planifié"
    ).length;

    const aVenir = appartement.services.filter(
      (s) => s.statut === "en_attente"
    ).length;

    // 🔔 Notifications
    const notifications = appartement.services.map((s) => ({
      id: s.id,
      message:
        s.statut === "terminé"
          ? `🎉 Service "${s.nom}" terminé`
          : s.statut === "planifié"
          ? `🟢 Service "${s.nom}" en cours`
          : `🕒 Service "${s.nom}" à venir`,
      type: s.statut === "terminé" ? "success" : "info",
    }));

    if (notifications.length === 0) {
      notifications.push({
        id: 0,
        message: "Aucun service enregistré pour l'instant.",
        type: "info",
      });
    }

    return NextResponse.json({
      nom: appartement.nom,
      ville: appartement.ville,
      noteMoyenne,
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
