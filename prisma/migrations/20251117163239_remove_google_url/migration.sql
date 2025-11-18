/*
  Warnings:

  - You are about to drop the `LocalContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "LocalContent";

-- CreateTable
CREATE TABLE "localContent" (
    "id" SERIAL NOT NULL,
    "ville" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "type" TEXT,
    "horaire" TEXT,
    "image" TEXT,

    CONSTRAINT "localContent_pkey" PRIMARY KEY ("id")
);
