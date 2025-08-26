-- AlterTable
ALTER TABLE "time_entries" ALTER COLUMN "is_approved" SET DEFAULT false,
ALTER COLUMN "approved_at" DROP NOT NULL,
ALTER COLUMN "approved_at" DROP DEFAULT;
