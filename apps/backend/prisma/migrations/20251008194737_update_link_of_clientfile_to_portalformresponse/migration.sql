/*
  Warnings:

  - You are about to drop the column `co_signed_by` on the `client_files` table. All the data in the column will be lost.
  - You are about to drop the column `co_signed_by_date` on the `client_files` table. All the data in the column will be lost.
  - You are about to drop the column `signed_date` on the `client_files` table. All the data in the column will be lost.
  - You are about to drop the column `patient_id` on the `portal_form_responses` table. All the data in the column will be lost.
  - You are about to drop the column `portal_form_id` on the `portal_form_responses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[client_file_id]` on the table `portal_form_responses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `client_file_id` to the `portal_form_responses` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "idx_portal_form_response_patient_id";

-- DropIndex
DROP INDEX "idx_portal_form_response_portal_form_id";

-- AlterTable
ALTER TABLE "client_files" DROP COLUMN "co_signed_by",
DROP COLUMN "co_signed_by_date",
DROP COLUMN "signed_date";

-- AlterTable
ALTER TABLE "portal_form_responses" DROP COLUMN "patient_id",
DROP COLUMN "portal_form_id",
ADD COLUMN     "client_file_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "portal_form_responses_client_file_id_key" ON "portal_form_responses"("client_file_id");

-- CreateIndex
CREATE INDEX "idx_portal_form_response_client_file_id" ON "portal_form_responses"("client_file_id");
