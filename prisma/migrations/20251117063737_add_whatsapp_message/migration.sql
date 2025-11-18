/*
  Warnings:

  - You are about to drop the column `icone` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `Service` table. All the data in the column will be lost.
  - Made the column `logement` on table `Service` required. This step will fail if there are existing NULL values in that column.
  - Made the column `prix` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "icone",
DROP COLUMN "whatsapp",
ADD COLUMN     "whatsappMessage" TEXT,
ALTER COLUMN "logement" SET NOT NULL,
ALTER COLUMN "prix" SET NOT NULL;
