/*
  Warnings:

  - You are about to drop the column `adminNote` on the `VerificationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `rejectionReason` on the `VerificationRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."VerificationRequest" DROP COLUMN "adminNote",
DROP COLUMN "rejectionReason";
