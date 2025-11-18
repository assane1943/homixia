/*
  Warnings:

  - You are about to drop the column `client` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `logement` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `prix` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "client",
DROP COLUMN "logement",
DROP COLUMN "prix";
