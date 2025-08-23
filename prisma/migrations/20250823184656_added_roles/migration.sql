-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('VOLUNTEER', 'ORGANISER', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."Volunteer" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'VOLUNTEER';
