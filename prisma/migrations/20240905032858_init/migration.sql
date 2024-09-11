/*
  Warnings:

  - A unique constraint covering the columns `[categoriId]` on the table `Article` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "categoriId" INTEGER;

-- CreateTable
CREATE TABLE "Categorie" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_categoriId_key" ON "Article"("categoriId");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoriId_fkey" FOREIGN KEY ("categoriId") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
