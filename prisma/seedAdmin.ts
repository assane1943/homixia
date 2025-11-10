import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@homixia.ma";
  const motDePasse = "homixia2025";

  // Vérifie si l'admin existe déjà
  const existing = await prisma.equipe.findUnique({
    where: { email },
  });

  if (existing) {
    console.log("✅ L'administrateur existe déjà :", existing.email);
    return;
  }

  // Crée le mot de passe haché
  const hashedPassword = await bcrypt.hash(motDePasse, 10);

  // Crée l'administrateur
  const admin = await prisma.equipe.create({
    data: {
      nom: "Administrateur Homixia",
      email,
      motDePasse: hashedPassword,
      telephone: "0000000000",
      role: "admin",
    },
  });

  console.log("✅ Administrateur créé avec succès !");
  console.log(`➡️  Email: ${email}`);
  console.log(`➡️  Mot de passe: ${motDePasse}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erreur seed admin :", e);
    await prisma.$disconnect();
    process.exit(1);
  });
