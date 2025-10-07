/*
  Warnings:

  - You are about to drop the column `billing_settings` on the `practice_settings` table. All the data in the column will be lost.
  - You are about to drop the column `business_hours` on the `practice_settings` table. All the data in the column will be lost.
  - You are about to drop the column `portal_settings` on the `practice_settings` table. All the data in the column will be lost.
  - You are about to drop the column `practice_address` on the `practice_settings` table. All the data in the column will be lost.
  - You are about to drop the column `practice_contact` on the `practice_settings` table. All the data in the column will be lost.
  - You are about to drop the column `practice_name` on the `practice_settings` table. All the data in the column will be lost.
  - You are about to drop the column `security_settings` on the `practice_settings` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `practice_settings` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "practice_settings_user_id_key";

-- AlterTable
ALTER TABLE "practice_settings" DROP COLUMN "billing_settings",
DROP COLUMN "business_hours",
DROP COLUMN "portal_settings",
DROP COLUMN "practice_address",
DROP COLUMN "practice_contact",
DROP COLUMN "practice_name",
DROP COLUMN "security_settings",
DROP COLUMN "user_id",
ADD COLUMN     "ai_settings" JSONB,
ADD COLUMN     "auth_settings" JSONB,
ADD COLUMN     "client_settings" JSONB,
ADD COLUMN     "compliance_settings" JSONB,
ADD COLUMN     "note_settings" JSONB,
ADD COLUMN     "practice_info" JSONB,
ADD COLUMN     "staff_settings" JSONB;
