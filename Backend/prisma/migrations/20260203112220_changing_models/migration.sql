/*
  Warnings:

  - You are about to drop the `Subcontractors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lagging_Indicators" DROP CONSTRAINT "Lagging_Indicators_subcontractorId_fkey";

-- DropForeignKey
ALTER TABLE "Subcontractors" DROP CONSTRAINT "Subcontractors_projectId_fkey";

-- DropTable
DROP TABLE "Subcontractors";

-- CreateTable
CREATE TABLE "Subcontractor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Subcontractor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lagging_Indicators" ADD CONSTRAINT "Lagging_Indicators_subcontractorId_fkey" FOREIGN KEY ("subcontractorId") REFERENCES "Subcontractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
