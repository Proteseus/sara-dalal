/*
  Warnings:

  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "QuestionCategory" ADD VALUE 'FEEDBACK';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isDay" BOOLEAN,
ADD COLUMN     "isNight" BOOLEAN,
ALTER COLUMN "description" SET NOT NULL;

-- CreateTable
CREATE TABLE "ProductFeedback" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "usage" TEXT NOT NULL,
    "discomfort" BOOLEAN NOT NULL,
    "discomfortImproving" BOOLEAN,
    "positiveChanges" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutineFeedback" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "routineId" INTEGER NOT NULL,
    "satisfaction" TEXT NOT NULL,
    "skinChanges" BOOLEAN NOT NULL,
    "easeOfUse" TEXT NOT NULL,
    "unnecessaryProductId" INTEGER,
    "primaryConcern" TEXT NOT NULL,
    "routinePreference" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoutineFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductFeedback_userId_productId_key" ON "ProductFeedback"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "RoutineFeedback_userId_routineId_key" ON "RoutineFeedback"("userId", "routineId");

-- AddForeignKey
ALTER TABLE "ProductFeedback" ADD CONSTRAINT "ProductFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFeedback" ADD CONSTRAINT "ProductFeedback_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineFeedback" ADD CONSTRAINT "RoutineFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineFeedback" ADD CONSTRAINT "RoutineFeedback_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "UserRoutine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineFeedback" ADD CONSTRAINT "RoutineFeedback_unnecessaryProductId_fkey" FOREIGN KEY ("unnecessaryProductId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
