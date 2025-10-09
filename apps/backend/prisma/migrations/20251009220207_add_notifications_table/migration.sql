-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_viewed" BOOLEAN NOT NULL DEFAULT false,
    "viewed_at" TIMESTAMP(3),
    "associated_link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_notification_receiver_id" ON "notifications"("receiver_id");

-- CreateIndex
CREATE INDEX "idx_notification_is_viewed" ON "notifications"("is_viewed");

-- CreateIndex
CREATE INDEX "idx_notification_created_at" ON "notifications"("created_at");
