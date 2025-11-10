-- CreateTable
CREATE TABLE "Equipe" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT,
    "motDePasse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appartement" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "pays" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "proprietaire" TEXT NOT NULL,
    "description" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "wifiSsid" TEXT,
    "wifiPassword" TEXT,
    "keyboxCode" TEXT,
    "keyboxPlace" TEXT,
    "imagePrincipale" TEXT,
    "imagesSecondaires" TEXT,
    "videosExplicatives" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appartement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "logement" TEXT NOT NULL,
    "prix" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appartementId" INTEGER,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avis" (
    "id" SERIAL NOT NULL,
    "appartementId" INTEGER,
    "nom" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalContent" (
    "id" SERIAL NOT NULL,
    "ville" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "adresse" TEXT,
    "horaire" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocalContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "proprietaire" TEXT NOT NULL,
    "pack" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "debut" TIMESTAMP(3),
    "fin" TIMESTAMP(3),
    "factures" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Local" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "adresse" TEXT,
    "telephone" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Abonnement" (
    "id" SERIAL NOT NULL,
    "pack" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "renouvellement" TIMESTAMP(3) NOT NULL,
    "facturesPayees" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Abonnement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipe_email_key" ON "Equipe"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Appartement_code_key" ON "Appartement"("code");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_appartementId_fkey" FOREIGN KEY ("appartementId") REFERENCES "Appartement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_appartementId_fkey" FOREIGN KEY ("appartementId") REFERENCES "Appartement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
