-- AlterTable
ALTER TABLE "files" ADD COLUMN     "file_hash" TEXT,
ADD COLUMN     "hash_algorithm" TEXT,
ADD COLUMN     "integrity_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_verified" TIMESTAMP(3);
