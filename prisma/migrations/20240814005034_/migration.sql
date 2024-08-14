/*
  Warnings:

  - You are about to drop the column `date` on the `Dette` table. All the data in the column will be lost.
  - You are about to drop the column `montantVerser` on the `Dette` table. All the data in the column will be lost.
  - You are about to drop the column `montant` on the `Paiement` table. All the data in the column will be lost.
  - Added the required column `montantRest` to the `Paiement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montantVerser` to the `Paiement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dette" DROP COLUMN "date",
DROP COLUMN "montantVerser";

-- AlterTable
ALTER TABLE "Paiement" DROP COLUMN "montant",
ADD COLUMN     "montantRest" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "montantVerser" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
