-- AlterTable
ALTER TABLE "patient_statements" ALTER COLUMN "email_sent_at" DROP NOT NULL,
ALTER COLUMN "email_sent_at" DROP DEFAULT,
ALTER COLUMN "email_opened_at" DROP NOT NULL,
ALTER COLUMN "email_opened_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "statement_line_items" ADD COLUMN     "claim_line_item_id" TEXT;
