/*
  Warnings:

  - You are about to drop the column `staff_profile_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_type` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[staff_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_staff_profile_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "staff_profile_id",
DROP COLUMN "user_type",
ADD COLUMN     "staff_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_staff_id_key" ON "users"("staff_id");
