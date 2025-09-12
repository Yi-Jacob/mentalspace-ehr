-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_role" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "description" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "device_type" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "old_values" JSONB,
    "new_values" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_audit_log_user_id" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "idx_audit_log_action" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "idx_audit_log_resource" ON "audit_logs"("resource");

-- CreateIndex
CREATE INDEX "idx_audit_log_created_at" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "idx_audit_log_device_type" ON "audit_logs"("device_type");
