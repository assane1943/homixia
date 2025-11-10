import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seed...");

  // ✅ Création ou mise à jour du compte admin
  const hashedPassword = await bcrypt.hash("homixia2025", 10);

  await prisma.equipe.upsert({
    where: { email: "admin@homixia.ma" },
    update: {},
    create: {
      nom: "Administrateur",
      role: "admin",
      telephone: "+212600000000",
      email: "admin@homixia.ma",
      motDePasse: hashedPassword,
    },
  });

  console.log("✅ Compte admin créé avec succès !");

  // ✅ Appartement test “Premium Anfa”
  await prisma.appartement.upsert({
    where: { code: "HX-CASA-001" },
    update: {},
    create: {
      code: "HX-CASA-001",
      nom: "Appartement Premium Anfa",
      ville: "Casablanca",
      pays: "Maroc",
      adresse: "Anfa, Casablanca",
      proprietaire: "Homixia Test",
      description:
        "Appartement moderne et lumineux situé à Anfa, idéal pour les séjours courts. Proche des restaurants, plage et commerces.",
      lat: 33.5883,
      lng: -7.6114,
      wifiSsid: "Homixia_Anfa_Wifi",
      wifiPassword: "anfa1234",
      keyboxCode: "4582",
      keyboxPlace: "Entrée principale - boîte noire",
      imagePrincipale:
        "https://res.cloudinary.com/demo/image/upload/v1729933421/anfa_main.jpg",
    },
  });

  console.log("🏠 Appartement Premium Anfa ajouté avec succès !");
}

main()
  .then(() => {
    console.log("🌿 Seed terminé !");
  })
  .catch((e) => {
    console.error("❌ Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
