/*
  Warnings:

  - Added the required column `montant` to the `Dette` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clientId_fkey";

-- AlterTable
ALTER TABLE "Dette" ADD COLUMN     "montant" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "Paiement_detteId_idx_unique" ON "Paiement"("detteId");

-- AddForeignKey
ALTER TABLE "Dette" ADD CONSTRAINT "Dette_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Dette_clientId_fkey" RENAME TO "Dette_clientId_idx_unique";
