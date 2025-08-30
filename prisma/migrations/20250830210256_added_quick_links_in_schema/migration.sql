-- CreateTable
CREATE TABLE "public"."QuickLink" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "eventId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuickLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."QuickLink" ADD CONSTRAINT "QuickLink_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuickLink" ADD CONSTRAINT "QuickLink_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
