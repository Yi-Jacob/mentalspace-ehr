-- AlterTable
ALTER TABLE "client_files" ADD COLUMN     "outcome_measure_id" TEXT;

-- CreateTable
CREATE TABLE "outcome_measures" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sharable" TEXT NOT NULL DEFAULT 'not_sharable',
    "accessLevel" TEXT NOT NULL DEFAULT 'admin',
    "content" JSONB NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outcome_measures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outcome_measure_responses" (
    "id" TEXT NOT NULL,
    "client_file_id" TEXT NOT NULL,
    "responses" JSONB NOT NULL,
    "total_score" INTEGER NOT NULL,
    "criteria" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outcome_measure_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_outcome_measure_sharable" ON "outcome_measures"("sharable");

-- CreateIndex
CREATE INDEX "idx_outcome_measure_access_level" ON "outcome_measures"("accessLevel");

-- CreateIndex
CREATE INDEX "idx_outcome_measure_created_by" ON "outcome_measures"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "outcome_measure_responses_client_file_id_key" ON "outcome_measure_responses"("client_file_id");

-- CreateIndex
CREATE INDEX "idx_outcome_measure_response_client_file_id" ON "outcome_measure_responses"("client_file_id");

-- CreateIndex
CREATE INDEX "idx_client_file_outcome_measure_id" ON "client_files"("outcome_measure_id");
