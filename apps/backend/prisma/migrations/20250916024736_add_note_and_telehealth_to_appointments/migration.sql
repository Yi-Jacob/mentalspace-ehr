-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "is_telehealth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "note_id" TEXT;
