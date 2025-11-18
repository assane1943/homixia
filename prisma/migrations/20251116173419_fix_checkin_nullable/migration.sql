-- AlterTable
ALTER TABLE "Appartement" ADD COLUMN     "contratUrl" TEXT;

-- AlterTable
ALTER TABLE "CheckIn" ADD COLUMN     "appartementCode" TEXT;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_appartementCode_fkey" FOREIGN KEY ("appartementCode") REFERENCES "Appartement"("code") ON DELETE SET NULL ON UPDATE CASCADE;
