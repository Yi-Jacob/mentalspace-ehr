-- AlterTable
ALTER TABLE "client_files" ADD COLUMN     "portal_form_id" TEXT,
ALTER COLUMN "file_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "portal_forms" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sharable" TEXT NOT NULL DEFAULT 'not_sharable',
    "accessLevel" TEXT NOT NULL DEFAULT 'admin',
    "panel_content" JSONB NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_form_responses" (
    "id" TEXT NOT NULL,
    "portal_form_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "signature" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_form_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_portal_form_sharable" ON "portal_forms"("sharable");

-- CreateIndex
CREATE INDEX "idx_portal_form_access_level" ON "portal_forms"("accessLevel");

-- CreateIndex
CREATE INDEX "idx_portal_form_created_by" ON "portal_forms"("created_by");

-- CreateIndex
CREATE INDEX "idx_portal_form_response_portal_form_id" ON "portal_form_responses"("portal_form_id");

-- CreateIndex
CREATE INDEX "idx_portal_form_response_patient_id" ON "portal_form_responses"("patient_id");

-- CreateIndex
CREATE INDEX "idx_client_file_portal_form_id" ON "client_files"("portal_form_id");
