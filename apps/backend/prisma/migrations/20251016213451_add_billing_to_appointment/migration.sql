/*
  Warnings:

  - You are about to drop the column `is_locked` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `is_note_signed` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `locked_at` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `note_signed_at` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `pay_period_week` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `supervisor_override_at` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `supervisor_override_by` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `supervisor_override_reason` on the `appointments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "is_locked",
DROP COLUMN "is_note_signed",
DROP COLUMN "locked_at",
DROP COLUMN "note_signed_at",
DROP COLUMN "pay_period_week",
DROP COLUMN "supervisor_override_at",
DROP COLUMN "supervisor_override_by",
DROP COLUMN "supervisor_override_reason",
ADD COLUMN     "payment_method" TEXT;
