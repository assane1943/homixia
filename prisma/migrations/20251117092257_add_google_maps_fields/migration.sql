-- AlterTable
ALTER TABLE "LocalContent" ADD COLUMN     "mapUrl" TEXT,
ALTER COLUMN "type" DROP NOT NULL;
