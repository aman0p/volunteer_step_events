/*
  Warnings:

  - The values [ENROLLMENT_CANCELLED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [CANCELLED] on the enum `VerificationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."NotificationType_new" AS ENUM ('ENROLLMENT_APPLICATION', 'ENROLLMENT_APPROVED', 'ENROLLMENT_REJECTED', 'ENROLLMENT_WAITLISTED', 'ENROLLMENT_SELF_CANCELLED', 'NEW_EVENT_ADDED', 'EVENT_UPDATE', 'EVENT_REMINDER', 'VERIFICATION_REQUEST', 'VERIFICATION_APPROVED', 'VERIFICATION_REJECTED', 'SYSTEM_MESSAGE');
ALTER TABLE "public"."Notification" ALTER COLUMN "type" TYPE "public"."NotificationType_new" USING ("type"::text::"public"."NotificationType_new");
ALTER TYPE "public"."NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "public"."NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "public"."NotificationType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."VerificationStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "public"."VerificationRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."VerificationRequest" ALTER COLUMN "status" TYPE "public"."VerificationStatus_new" USING ("status"::text::"public"."VerificationStatus_new");
ALTER TYPE "public"."VerificationStatus" RENAME TO "VerificationStatus_old";
ALTER TYPE "public"."VerificationStatus_new" RENAME TO "VerificationStatus";
DROP TYPE "public"."VerificationStatus_old";
ALTER TABLE "public"."VerificationRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Enrollment" ADD COLUMN     "cancellationCount" INTEGER NOT NULL DEFAULT 0;
