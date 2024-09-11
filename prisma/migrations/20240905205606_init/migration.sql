-- CreateEnum
CREATE TYPE "EtaDemande" AS ENUM ('ACCEPTER', 'NON_ACCEPTER', 'EN_ATTENTE');

-- CreateTable
CREATE TABLE "Demande" (
    "id" SERIAL NOT NULL,
    "detteId" INTEGER,
    "etatDemande" "EtaDemande" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Demande_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Demande_detteId_key" ON "Demande"("detteId");

-- AddForeignKey
ALTER TABLE "Demande" ADD CONSTRAINT "Demande_detteId_fkey" FOREIGN KEY ("detteId") REFERENCES "Dette"("id") ON DELETE SET NULL ON UPDATE CASCADE;
