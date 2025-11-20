/*
  Warnings:

  - Made the column `email` on table `Equipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `motDePasse` on table `Equipe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Equipe" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "motDePasse" SET NOT NULL;
