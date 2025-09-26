/*
  Warnings:

  - You are about to drop the column `author_id` on the `files` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "idx_file_author_id";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "author_id";
