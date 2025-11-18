/*
  Warnings:

  - You are about to drop the column `proprietaire` on the `Appartement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appartement" DROP COLUMN "proprietaire",
ADD COLUMN     "equipements" TEXT,
ADD COLUMN     "proprietaireEmail" TEXT,
ADD COLUMN     "proprietaireNom" TEXT,
ADD COLUMN     "proprietaireTel" TEXT,
ADD COLUMN     "regles" TEXT;
