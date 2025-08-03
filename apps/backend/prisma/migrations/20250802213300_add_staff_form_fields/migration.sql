-- AlterTable
ALTER TABLE "staff_profiles" ADD COLUMN     "address_1" TEXT,
ADD COLUMN     "address_2" TEXT,
ADD COLUMN     "can_receive_text" BOOLEAN,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "clinician_type" TEXT,
ADD COLUMN     "formal_name" TEXT,
ADD COLUMN     "home_phone" TEXT,
ADD COLUMN     "mobile_phone" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "supervision_type" TEXT,
ADD COLUMN     "user_comments" TEXT,
ADD COLUMN     "work_phone" TEXT,
ADD COLUMN     "zip_code" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "middle_name" TEXT,
ADD COLUMN     "suffix" TEXT,
ADD COLUMN     "user_name" TEXT;
