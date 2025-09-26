/*
  Warnings:

  - You are about to drop the column `file_name` on the `client_files` table. All the data in the column will be lost.
  - You are about to drop the column `file_size` on the `client_files` table. All the data in the column will be lost.
  - You are about to drop the column `file_url` on the `client_files` table. All the data in the column will be lost.
  - You are about to drop the column `mime_type` on the `client_files` table. All the data in the column will be lost.
  - Added the required column `file_id` to the `client_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "client_files" DROP COLUMN "file_name",
DROP COLUMN "file_size",
DROP COLUMN "file_url",
DROP COLUMN "mime_type",
ADD COLUMN     "file_id" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT;

-- CreateIndex
CREATE INDEX "idx_client_file_file_id" ON "client_files"("file_id");
