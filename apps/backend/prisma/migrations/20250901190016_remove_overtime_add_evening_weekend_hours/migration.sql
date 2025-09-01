/*
  Warnings:

  - You are about to drop the column `overtime_hours` on the `time_entries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "time_entries" DROP COLUMN "overtime_hours",
ADD COLUMN     "evening_hours" DOUBLE PRECISION,
ADD COLUMN     "weekend_hours" DOUBLE PRECISION;
