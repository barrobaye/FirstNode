-- DropIndex
DROP INDEX "Article_categoriId_key";

-- CreateIndex
CREATE INDEX "Article_categoriId_idx_unique" ON "Article"("categoriId");
