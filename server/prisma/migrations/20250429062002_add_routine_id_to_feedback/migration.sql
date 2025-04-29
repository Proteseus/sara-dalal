/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId,routineId]` on the table `UserFeedback` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserFeedback_userId_productId_key";

-- AlterTable
ALTER TABLE "UserFeedback" ADD COLUMN     "routineId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "UserFeedback_userId_productId_routineId_key" ON "UserFeedback"("userId", "productId", "routineId");

-- AddForeignKey
ALTER TABLE "UserFeedback" ADD CONSTRAINT "UserFeedback_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "UserRoutine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
