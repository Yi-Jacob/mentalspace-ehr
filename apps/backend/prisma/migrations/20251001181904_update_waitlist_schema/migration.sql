/*
  Warnings:

  - You are about to drop the column `appointment_type` on the `appointment_waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `fulfilled_appointment_id` on the `appointment_waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `notified_at` on the `appointment_waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_time_end` on the `appointment_waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `appointment_waitlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "appointment_waitlist" DROP COLUMN "appointment_type",
DROP COLUMN "fulfilled_appointment_id",
DROP COLUMN "notified_at",
DROP COLUMN "preferred_time_end",
DROP COLUMN "priority",
ADD COLUMN     "is_telehealth" BOOLEAN NOT NULL DEFAULT false;
