/*
  Warnings:

  - You are about to drop the column `comment` on the `UserFeedback` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,productId]` on the table `UserFeedback` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RoutineStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RoutineStep" ADD COLUMN     "categoryName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserFeedback" DROP COLUMN "comment",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "StepAlternative" (
    "id" SERIAL NOT NULL,
    "stepId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "keyIngredients" TEXT[],
    "isNatural" BOOLEAN NOT NULL,
    "isGentle" BOOLEAN NOT NULL,
    "score" DOUBLE PRECISION,
    "scoreBreakdown" JSONB,
    "userRating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StepAlternative_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFeedback_userId_productId_key" ON "UserFeedback"("userId", "productId");

-- AddForeignKey
ALTER TABLE "StepAlternative" ADD CONSTRAINT "StepAlternative_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "RoutineStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepAlternative" ADD CONSTRAINT "StepAlternative_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
