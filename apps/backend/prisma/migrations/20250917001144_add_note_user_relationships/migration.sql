-- AlterTable
ALTER TABLE "clinical_notes" ADD COLUMN     "locked_by" TEXT,
ADD COLUMN     "unlocked_at" TIMESTAMP(3),
ADD COLUMN     "unlocked_by" TEXT,
ALTER COLUMN "locked_at" DROP NOT NULL,
ALTER COLUMN "locked_at" DROP DEFAULT;
