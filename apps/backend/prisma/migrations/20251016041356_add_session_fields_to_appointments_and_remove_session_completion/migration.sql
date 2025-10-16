/*
  Warnings:

  - You are about to drop the `deadline_exception_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session_completions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "calculated_amount" DOUBLE PRECISION,
ADD COLUMN     "has_session" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_locked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_note_signed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locked_at" TIMESTAMP(3),
ADD COLUMN     "note_signed_at" TIMESTAMP(3),
ADD COLUMN     "pay_period_week" TIMESTAMP(3),
ADD COLUMN     "supervisor_override_at" TIMESTAMP(3),
ADD COLUMN     "supervisor_override_by" TEXT,
ADD COLUMN     "supervisor_override_reason" TEXT;

-- DropTable
DROP TABLE "deadline_exception_requests";

-- DropTable
DROP TABLE "session_completions";
