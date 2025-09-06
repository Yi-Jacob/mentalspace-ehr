-- CreateTable
CREATE TABLE "adjustments" (
    "id" TEXT NOT NULL,
    "claim_line_item_id" TEXT NOT NULL,
    "payment_id" TEXT,
    "source_type" TEXT NOT NULL,
    "group_code" TEXT NOT NULL,
    "reason_code" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason_text" TEXT,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adjustments_pkey" PRIMARY KEY ("id")
);
