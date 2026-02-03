/*
  Warnings:

  - You are about to drop the column `subcontractorId` on the `Lagging_Indicators` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lagging_Indicators" DROP CONSTRAINT "Lagging_Indicators_subcontractorId_fkey";

-- AlterTable
ALTER TABLE "Lagging_Indicators" DROP COLUMN "subcontractorId",
ADD COLUMN     "contractorId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Lagging_Indicators" ADD CONSTRAINT "Lagging_Indicators_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
