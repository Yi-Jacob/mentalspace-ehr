/*
  Warnings:

  - You are about to drop the column `author` on the `files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "author",
ADD COLUMN     "author_id" TEXT;

-- CreateIndex
CREATE INDEX "idx_file_author_id" ON "files"("author_id");
