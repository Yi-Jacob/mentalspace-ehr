-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "author" TEXT,
    "sharable" TEXT NOT NULL DEFAULT 'not_sharable',
    "accessLevel" TEXT NOT NULL DEFAULT 'admin',
    "is_for_patient" BOOLEAN NOT NULL DEFAULT false,
    "is_for_staff" BOOLEAN NOT NULL DEFAULT false,
    "client_id" TEXT,
    "user_id" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_file_sharable" ON "files"("sharable");

-- CreateIndex
CREATE INDEX "idx_file_access_level" ON "files"("accessLevel");

-- CreateIndex
CREATE INDEX "idx_file_created_by" ON "files"("created_by");
