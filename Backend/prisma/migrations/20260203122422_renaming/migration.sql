/*
  Warnings:

  - You are about to drop the `ProjectOrganization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lagging_Indicators" DROP CONSTRAINT "Lagging_Indicators_subcontractorId_fkey";

-- DropTable
DROP TABLE "ProjectOrganization";

-- CreateTable
CREATE TABLE "Contractors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Contractors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contractors_name_key" ON "Contractors"("name");

-- AddForeignKey
ALTER TABLE "Lagging_Indicators" ADD CONSTRAINT "Lagging_Indicators_subcontractorId_fkey" FOREIGN KEY ("subcontractorId") REFERENCES "Contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
