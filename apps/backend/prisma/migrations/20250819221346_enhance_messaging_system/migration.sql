/*
  Warnings:

  - You are about to drop the column `is_read` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `read_at` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `message_recipients` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'individual';

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "is_read",
DROP COLUMN "read_at",
ADD COLUMN     "reply_to_id" TEXT;

-- DropTable
DROP TABLE "message_recipients";

-- CreateTable
CREATE TABLE "conversation_participants" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'participant',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_read_receipts" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_read_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "message_read_receipts_message_id_user_id_key" ON "message_read_receipts"("message_id", "user_id");
