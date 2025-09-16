/*
  Warnings:

  - You are about to drop the column `approved_at` on the `clinical_notes` table. All the data in the column will be lost.
  - You are about to drop the column `approved_by` on the `clinical_notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clinical_notes" DROP COLUMN "approved_at",
DROP COLUMN "approved_by";
