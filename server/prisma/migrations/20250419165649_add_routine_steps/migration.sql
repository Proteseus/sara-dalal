/*
  Warnings:

  - You are about to drop the column `description` on the `UserRoutine` table. All the data in the column will be lost.
  - You are about to drop the `RoutineProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoutineProduct" DROP CONSTRAINT "RoutineProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "RoutineProduct" DROP CONSTRAINT "RoutineProduct_routineId_fkey";

-- AlterTable
ALTER TABLE "SkinProfile" ADD COLUMN     "lifestyleFactors" JSONB,
ADD COLUMN     "recommendations" JSONB;

-- AlterTable
ALTER TABLE "UserRoutine" DROP COLUMN "description";

-- DropTable
DROP TABLE "RoutineProduct";

-- CreateTable
CREATE TABLE "RoutineStep" (
    "id" SERIAL NOT NULL,
    "routineId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "time" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoutineStep_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoutineStep" ADD CONSTRAINT "RoutineStep_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "UserRoutine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineStep" ADD CONSTRAINT "RoutineStep_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
