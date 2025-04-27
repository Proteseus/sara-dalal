-- AlterTable
ALTER TABLE "RoutineStep" ADD COLUMN     "defaultProductId" INTEGER;

-- AddForeignKey
ALTER TABLE "RoutineStep" ADD CONSTRAINT "RoutineStep_defaultProductId_fkey" FOREIGN KEY ("defaultProductId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
