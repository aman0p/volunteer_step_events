/*
  Warnings:

  - You are about to drop the column `phone` on the `Volunteer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Volunteer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phoneNumber` to the `Volunteer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Volunteer_phone_key";

-- AlterTable
ALTER TABLE "public"."Volunteer" DROP COLUMN "phone",
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_phoneNumber_key" ON "public"."Volunteer"("phoneNumber");
