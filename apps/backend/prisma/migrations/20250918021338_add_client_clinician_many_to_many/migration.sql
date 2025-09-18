/*
  Warnings:

  - You are about to drop the column `assigned_clinician_id` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the `quick_actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `training_records` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "assigned_clinician_id";

-- DropTable
DROP TABLE "quick_actions";

-- DropTable
DROP TABLE "training_records";

-- CreateTable
CREATE TABLE "client_clinicians" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" TEXT,

    CONSTRAINT "client_clinicians_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_clinicians_client_id_clinician_id_key" ON "client_clinicians"("client_id", "clinician_id");
