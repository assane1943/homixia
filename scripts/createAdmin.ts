import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@homixia.com";
  const password = "admin1234"; // 🔐 tu peux changer ensuite

  const hash = await bcrypt.hash(password, 10);

  const admin = await prisma.equipe.create({
    data: {
      nom: "Admin Principal",
      role: "admin",
      telephone: "+212600000000",
      email,
      motDePasse: hash,
    },
  });

  console.log("🎉 ADMIN CRÉÉ AVEC SUCCÈS !");
  console.log("Email :", admin.email);
  console.log("Mot de passe :", password);
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });
