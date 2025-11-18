-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "clientNom" TEXT NOT NULL,
    "clientEmail" TEXT,
    "clientTel" TEXT,
    "debut" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'confirmée',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appartementId" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_appartementId_fkey" FOREIGN KEY ("appartementId") REFERENCES "Appartement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
