-- CreateTable
CREATE TABLE "client_files" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_by" TEXT NOT NULL,
    "signed_date" TIMESTAMP(3),
    "co_signed_by" TEXT,
    "co_signed_by_date" TIMESTAMP(3),
    "is_completed_on_staff" BOOLEAN NOT NULL DEFAULT false,
    "completed_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_client_file_client_id" ON "client_files"("client_id");

-- CreateIndex
CREATE INDEX "idx_client_file_status" ON "client_files"("status");

-- CreateIndex
CREATE INDEX "idx_client_file_created_by" ON "client_files"("created_by");
