-- CreateTable
CREATE TABLE "SkinProfileHistory" (
    "id" SERIAL NOT NULL,
    "skinProfileId" INTEGER NOT NULL,
    "skinType" TEXT,
    "concerns" TEXT[],
    "allergies" TEXT[],
    "currentRoutine" TEXT,
    "lifestyleFactors" JSONB,
    "recommendations" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkinProfileHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SkinProfileHistory" ADD CONSTRAINT "SkinProfileHistory_skinProfileId_fkey" FOREIGN KEY ("skinProfileId") REFERENCES "SkinProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
