-- AlterTable
ALTER TABLE "public"."Enrollment" ADD COLUMN     "eventRoleId" TEXT,
ADD COLUMN     "payoutAmount" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."EventRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "payout" DOUBLE PRECISION NOT NULL,
    "maxCount" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRole_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EventRole" ADD CONSTRAINT "EventRole_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_eventRoleId_fkey" FOREIGN KEY ("eventRoleId") REFERENCES "public"."EventRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
