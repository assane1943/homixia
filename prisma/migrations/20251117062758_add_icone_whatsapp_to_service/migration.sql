/*
  Warnings:

  - Made the column `client` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "icone" TEXT NOT NULL DEFAULT '🧰',
ADD COLUMN     "whatsapp" TEXT NOT NULL DEFAULT '+212665247695',
ALTER COLUMN "client" SET NOT NULL;
