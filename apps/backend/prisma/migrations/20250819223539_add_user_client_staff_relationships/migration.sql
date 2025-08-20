/*
  Warnings:

  - You are about to drop the column `user_id` on the `staff_profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[client_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[staff_profile_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "staff_profiles" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "client_id" TEXT,
ADD COLUMN     "staff_profile_id" TEXT,
ADD COLUMN     "user_type" TEXT NOT NULL DEFAULT 'staff';

-- CreateIndex
CREATE UNIQUE INDEX "users_client_id_key" ON "users"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_staff_profile_id_key" ON "users"("staff_profile_id");
