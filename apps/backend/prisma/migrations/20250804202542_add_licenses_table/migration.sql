/*
  Warnings:

  - You are about to drop the column `is_active` on the `supervision_relationships` table. All the data in the column will be lost.
  - You are about to drop the column `supervision_type` on the `supervision_relationships` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "supervision_relationships" DROP COLUMN "is_active",
DROP COLUMN "supervision_type",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "termination_notes" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "licenses" (
    "id" TEXT NOT NULL,
    "staff_id" TEXT NOT NULL,
    "license_type" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "license_expiration_date" TIMESTAMP(3) NOT NULL,
    "license_status" TEXT NOT NULL,
    "license_state" TEXT NOT NULL,
    "issued_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);
